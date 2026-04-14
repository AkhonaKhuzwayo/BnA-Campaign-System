const router = require('express').Router();
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { getReportData } = require('../../services/reportService');

function getDateRange(type, param) {
  if (type === 'daily') {
    const date = param || new Date().toISOString().slice(0,10);
    return { from: date + 'T00:00:00.000Z', to: date + 'T23:59:59.999Z' };
  }
  if (type === 'weekly') {
    const start = param || new Date().toISOString().slice(0,10);
    const end = new Date(new Date(start).getTime() + 6*24*60*60*1000).toISOString().slice(0,10);
    return { from: start + 'T00:00:00.000Z', to: end + 'T23:59:59.999Z' };
  }
  if (type === 'monthly') {
    const [year, month] = (param || new Date().toISOString().slice(0,7)).split('-');
    const from = `${year}-${month}-01T00:00:00.000Z`;
    const lastDay = new Date(year, month, 0).getDate();
    const to = `${year}-${month}-${String(lastDay).padStart(2,'0')}T23:59:59.999Z`;
    return { from, to };
  }
  return { from: new Date(0).toISOString(), to: new Date().toISOString() };
}

router.get('/daily', async (req, res, next) => {
  try {
    const range = getDateRange('daily', req.query.date);
    const data = await getReportData(range);
    res.json(data);
  } catch (err) { next(err); }
});

router.get('/weekly', async (req, res, next) => {
  try {
    const range = getDateRange('weekly', req.query.startDate);
    const data = await getReportData(range);
    res.json(data);
  } catch (err) { next(err); }
});

router.get('/monthly', async (req, res, next) => {
  try {
    const range = getDateRange('monthly', req.query.month);
    const data = await getReportData(range);
    res.json(data);
  } catch (err) { next(err); }
});

router.get('/daily/pdf', async (req, res, next) => {
  try {
    const range = getDateRange('daily', req.query.date);
    const data = await getReportData(range);
    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="daily-report-${req.query.date||'today'}.pdf"`);
    doc.pipe(res);
    doc.fontSize(18).fillColor('#000').text('BnA Campaign Daily Report', { align: 'center' });
    doc.moveDown().fontSize(11).text(`Date: ${req.query.date || new Date().toISOString().slice(0,10)}`);
    doc.text(`Generated: ${new Date().toISOString()}`);
    doc.moveDown().fontSize(14).text('Summary');
    doc.fontSize(11).text(`Total Activations: ${data.summary.totalActivations}`);
    doc.text(`Total Employees Active: ${data.summary.totalEmployees}`);
    doc.moveDown().fontSize(14).text('By Employee');
    for (const e of data.byEmployee) {
      doc.fontSize(10).text(`${e.name} (${e.campaign||'N/A'}): ${e.activations} activations | In: ${e.clockedIn||'-'} | Out: ${e.clockedOut||'-'}`);
    }
    doc.end();
  } catch (err) { next(err); }
});

router.get('/daily/excel', async (req, res, next) => {
  try {
    const range = getDateRange('daily', req.query.date);
    const data = await getReportData(range);
    const wb = new ExcelJS.Workbook();

    const ws1 = wb.addWorksheet('Summary');
    ws1.addRow(['BnA Campaign Daily Report']);
    ws1.addRow(['Date', req.query.date || new Date().toISOString().slice(0,10)]);
    ws1.addRow(['Generated', new Date().toISOString()]);
    ws1.addRow([]);
    ws1.addRow(['Employee', 'Campaign', 'Activations', 'Clocked In', 'Clocked Out']);
    for (const e of data.byEmployee) {
      ws1.addRow([e.name, e.campaign||'', e.activations, e.clockedIn||'', e.clockedOut||'']);
    }

    const ws2 = wb.addWorksheet('Detail');
    ws2.addRow(['Employee', 'Campaign', 'Location', 'Customer First Name', 'Customer Surname', 'ID Number', 'Time']);
    for (const a of data.activations) {
      ws2.addRow([a.employee_name, a.campaign_name||'', a.location, a.customer_first_name, a.customer_surname, a.customer_id_number||'', a.activation_time]);
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="daily-report-${req.query.date||'today'}.xlsx"`);
    await wb.xlsx.write(res);
    res.end();
  } catch (err) { next(err); }
});

module.exports = router;
