import{b as E,u as z,s as y,j as e}from"./index-fxiljYcy.js";import{u as A,r as m}from"./vendor-BLcsky2j.js";import{C as d}from"./card-YymL3LOl.js";import{B as p}from"./button-67T2Pfwa.js";import{B as l}from"./badge-Co5L7Nl6.js";import{t as g,N as S,R as w,y as L,F,c as B,e as j,W as R,V as Y,J as O,C as _}from"./ui-CwHjF2mG.js";import{A as N}from"./api-CajA5vOO.js";import"./supabase-B07dSRCg.js";function Z(){const u=A(),{user:U}=E(),{t:V}=z(),[n,v]=m.useState([]),[h,b]=m.useState(!0),C=!1,G="client-invoices-demo";m.useEffect(()=>{P()},[]);const P=async()=>{var t;b(!0);try{const{data:s}=await y.auth.getSession();if(!((t=s.session)!=null&&t.access_token))throw new Error("Please log in again");const a=await fetch(N.invoices,{headers:{Authorization:`Bearer ${s.session.access_token}`}}),o=await a.json();if(!a.ok)throw new Error(o.error||"Failed to fetch invoices");v(o.invoices||[])}catch(s){console.error("Error fetching invoices:",s),g.error(s.message||"Failed to load invoices")}finally{b(!1)}},D=t=>{switch(t){case"paid":return e.jsxs(l,{className:"bg-green-100 text-green-700 border-green-300",children:[e.jsx(j,{className:"w-3 h-3 mr-1"}),"Paid"]});case"pending":return e.jsxs(l,{className:"bg-yellow-100 text-yellow-700 border-yellow-300",children:[e.jsx(_,{className:"w-3 h-3 mr-1"}),"Pending"]});case"cancelled":return e.jsxs(l,{className:"bg-gray-100 text-gray-700 border-gray-300",children:[e.jsx(O,{className:"w-3 h-3 mr-1"}),"Cancelled"]});default:return null}},I=t=>{switch(t){case"initial":return e.jsx(l,{variant:"outline",className:"bg-blue-50 text-blue-700 border-blue-300",children:"Initial Payment"});case"final":return e.jsx(l,{variant:"outline",className:"bg-purple-50 text-purple-700 border-purple-300",children:"Final Payment"});default:return null}},k=async t=>{var s;try{const{data:a}=await y.auth.getSession();if(!((s=a.session)!=null&&s.access_token))throw new Error("Please log in again");const o=await fetch(N.invoicePdf(t),{headers:{Authorization:`Bearer ${a.session.access_token}`}});if(!o.ok)throw new Error("Failed to generate invoice PDF");const r=await o.blob(),c=window.URL.createObjectURL(r),i=document.createElement("a");i.href=c,i.download=`${t}.pdf`,document.body.appendChild(i),i.click(),window.URL.revokeObjectURL(c),document.body.removeChild(i),g.success("Invoice downloaded successfully!")}catch(a){console.error("Error downloading invoice:",a),g.error(a.message||"Failed to download invoice")}},T=async t=>{const s=$(t),a=new Blob([s],{type:"text/html"}),o=window.URL.createObjectURL(a);window.open(o,"_blank")},$=t=>{const s=r=>new Date(r).toLocaleDateString("en-CA",{year:"numeric",month:"long",day:"numeric"}),a=(r,c)=>new Intl.NumberFormat("en-CA",{style:"currency",currency:c}).format(r),o=t.status==="paid"?'<span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">PAID</span>':'<span style="background: #f59e0b; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">PENDING</span>';return`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${t.invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 40px;
      background: #f9fafb;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 60px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 2px solid #e5e7eb;
    }
    .company-info h1 {
      color: #2563eb;
      font-size: 28px;
      margin-bottom: 8px;
    }
    .company-info p {
      color: #6b7280;
      font-size: 14px;
      line-height: 1.4;
    }
    .invoice-meta {
      text-align: right;
    }
    .invoice-meta h2 {
      font-size: 32px;
      color: #111827;
      margin-bottom: 8px;
    }
    .invoice-number {
      font-size: 16px;
      color: #6b7280;
      margin-bottom: 12px;
    }
    .details-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .detail-box h3 {
      font-size: 12px;
      text-transform: uppercase;
      color: #6b7280;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    .detail-box p {
      font-size: 14px;
      color: #111827;
      margin-bottom: 4px;
    }
    .items-table {
      width: 100%;
      margin: 40px 0;
      border-collapse: collapse;
    }
    .items-table thead {
      background: #f3f4f6;
    }
    .items-table th {
      padding: 12px;
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
      color: #6b7280;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .items-table td {
      padding: 16px 12px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
    }
    .items-table tbody tr:last-child td {
      border-bottom: 2px solid #e5e7eb;
    }
    .total-section {
      margin-top: 30px;
      text-align: right;
    }
    .total-row {
      display: flex;
      justify-content: flex-end;
      padding: 8px 0;
      font-size: 14px;
    }
    .total-row.grand-total {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      padding-top: 16px;
      margin-top: 16px;
      border-top: 2px solid #e5e7eb;
    }
    .total-label {
      margin-right: 40px;
      color: #6b7280;
    }
    .total-row.grand-total .total-label {
      color: #111827;
    }
    .total-amount {
      min-width: 120px;
      text-align: right;
      color: #111827;
    }
    .footer {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    .footer p {
      margin: 4px 0;
    }
    .status-badge {
      display: inline-block;
      margin-top: 8px;
    }
    .notes-section {
      background: #f9fafb;
      padding: 20px;
      border-radius: 6px;
      margin: 30px 0;
      border-left: 4px solid #2563eb;
    }
    .notes-section h4 {
      color: #111827;
      font-size: 14px;
      margin-bottom: 8px;
    }
    .notes-section p {
      color: #6b7280;
      font-size: 13px;
      line-height: 1.6;
    }
    .tax-note {
      margin-top: 20px;
      padding: 12px;
      background: #f0f9ff;
      border-left: 3px solid #3b82f6;
      font-size: 12px;
      color: #1e40af;
    }
    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #2563eb;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .print-button:hover {
      background: #1d4ed8;
    }
    @media print {
      .print-button { display: none; }
      body { padding: 0; background: white; }
    }
  </style>
</head>
<body>
  <button class="print-button" onclick="window.print()">🖨️ Print / Save as PDF</button>
  <div class="invoice-container">
    <!-- Header -->
    <div class="header">
      <div class="company-info">
        <h1>DuoProServices</h1>
        <p>Professional Tax Services</p>
        <p>Email: [Your Email]</p>
        <p>Phone: [Your Phone]</p>
      </div>
      <div class="invoice-meta">
        <h2>INVOICE</h2>
        <p class="invoice-number">${t.invoiceNumber}</p>
        <div class="status-badge">${o}</div>
      </div>
    </div>

    <!-- Details Section -->
    <div class="details-section">
      <div class="detail-box">
        <h3>Bill To</h3>
        <p><strong>${t.userName}</strong></p>
        <p>${t.userEmail}</p>
      </div>
      <div class="detail-box">
        <h3>Invoice Details</h3>
        <p><strong>Date Issued:</strong> ${s(t.createdAt)}</p>
        <p><strong>Tax Year:</strong> ${t.year}</p>
        ${t.paidAt?`<p><strong>Date Paid:</strong> ${s(t.paidAt)}</p>`:""}
      </div>
    </div>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: center;">Quantity</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${t.type==="initial"?`${t.year} tax return processing (filed in ${t.year-1})`:t.description}</strong>
            ${t.documentCount>0?`<br><small style="color: #6b7280;">${t.documentCount} document${t.documentCount!==1?"s":""} submitted</small>`:""}
          </td>
          <td style="text-align: center;">1</td>
          <td style="text-align: right;">${a(t.amount,t.currency)}</td>
        </tr>
      </tbody>
    </table>

    <!-- Total Section -->
    <div class="total-section">
      <div class="total-row">
        <span class="total-label">Subtotal:</span>
        <span class="total-amount">${a(t.amount,t.currency)}</span>
      </div>
      <div class="total-row">
        <span class="total-label">Tax (Included)*:</span>
        <span class="total-amount">$0.00</span>
      </div>
      <div class="total-row grand-total">
        <span class="total-label">Total Due:</span>
        <span class="total-amount">${a(t.amount,t.currency)}</span>
      </div>
    </div>

    <!-- Tax Note -->
    <div class="tax-note">
      <strong>* Tax Information:</strong> Personal tax preparation services are exempt from GST/HST in Canada under Schedule V, Part II, Section 12 of the Excise Tax Act.
    </div>

    <!-- Notes Section -->
    <div class="notes-section">
      <h4>Payment Information</h4>
      <p>
        ${t.status==="paid"?"This invoice has been paid in full. Thank you for your business!":"This invoice is currently pending payment. Please complete payment to proceed with your tax filing."}
      </p>
      ${t.type==="initial"?`<p style="margin-top: 8px;">This initial payment allows us to begin processing your ${t.year} tax return. The final balance will be invoiced once your return is complete.</p>`:""}
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>DuoProServices - Professional Tax Services</strong></p>
      <p>Thank you for choosing our services!</p>
      <p style="margin-top: 12px; font-size: 11px;">
        Questions? Contact us at [Your Email] or call [Your Phone]
      </p>
    </div>
  </div>
</body>
</html>
    `},f=t=>new Date(t).toLocaleDateString("en-CA",{year:"numeric",month:"long",day:"numeric"}),x=(t,s)=>new Intl.NumberFormat("en-CA",{style:"currency",currency:s}).format(t);return e.jsx("div",{className:"min-h-screen bg-gray-50 py-8 px-4",children:e.jsxs("div",{className:"max-w-6xl mx-auto",children:[e.jsxs("div",{className:"mb-6",children:[e.jsxs(p,{variant:"ghost",onClick:()=>u("/dashboard"),className:"mb-4",children:[e.jsx(S,{className:"w-4 h-4 mr-2"}),"Back to Dashboard"]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center",children:e.jsx(w,{className:"w-6 h-6 text-white"})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900",children:"My Invoices"}),e.jsx("p",{className:"text-gray-600",children:"View and download your tax filing invoices"})]})]})]}),h?e.jsx(d,{className:"p-12",children:e.jsxs("div",{className:"flex flex-col items-center justify-center",children:[e.jsx(L,{className:"w-8 h-8 text-blue-600 animate-spin mb-4"}),e.jsx("p",{className:"text-gray-600",children:"Loading invoices..."})]})}):n.length===0?e.jsx(d,{className:"p-12",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4",children:e.jsx(w,{className:"w-8 h-8 text-gray-400"})}),e.jsx("h3",{className:"text-lg font-semibold text-gray-900 mb-2",children:"No Invoices Yet"}),e.jsx("p",{className:"text-gray-600 mb-6",children:"Your invoices will appear here once you start filing your taxes."}),e.jsx(p,{onClick:()=>u("/dashboard"),children:"Go to Dashboard"})]})}):e.jsx("div",{className:"space-y-4",children:n.map(t=>e.jsx(d,{className:"p-6 hover:shadow-lg transition-shadow",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[e.jsx(F,{className:"w-5 h-5 text-blue-600"}),e.jsx("h3",{className:"font-semibold text-lg text-gray-900",children:t.invoiceNumber}),D(t.status),I(t.type)]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-gray-500 mb-1",children:"Amount"}),e.jsx("p",{className:"font-semibold text-gray-900",children:x(t.amount,t.currency)})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-gray-500 mb-1",children:"Tax Year"}),e.jsx("p",{className:"font-medium text-gray-900",children:t.year})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-gray-500 mb-1",children:"Issued Date"}),e.jsxs("p",{className:"font-medium text-gray-900 flex items-center gap-1",children:[e.jsx(B,{className:"w-3 h-3"}),f(t.createdAt)]})]}),t.paidAt&&e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-gray-500 mb-1",children:"Paid Date"}),e.jsxs("p",{className:"font-medium text-green-700 flex items-center gap-1",children:[e.jsx(j,{className:"w-3 h-3"}),f(t.paidAt)]})]})]}),e.jsx("p",{className:"text-sm text-gray-600",children:t.description}),t.documentCount>0&&e.jsxs("p",{className:"text-xs text-gray-500 mt-2",children:[t.documentCount," document",t.documentCount!==1?"s":""," submitted"]})]}),e.jsxs("div",{className:"ml-4 flex flex-col gap-2",children:[e.jsxs(p,{variant:"default",size:"sm",onClick:()=>T(t),className:"bg-blue-600 hover:bg-blue-700",children:[e.jsx(R,{className:"w-4 h-4 mr-2"}),"View Invoice"]}),e.jsxs(p,{variant:"outline",size:"sm",onClick:()=>k(t.invoiceNumber),children:[e.jsx(Y,{className:"w-4 h-4 mr-2"}),"Download PDF"]})]})]})},t.invoiceNumber))}),!h&&n.length>0&&e.jsx(d,{className:"p-6 mt-6 bg-gradient-to-br from-blue-50 to-indigo-50",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-600 mb-1",children:"Total Invoices"}),e.jsx("p",{className:"text-2xl font-bold text-gray-900",children:n.length})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-600 mb-1",children:"Total Paid"}),e.jsx("p",{className:"text-2xl font-bold text-green-600",children:x(n.filter(t=>t.status==="paid").reduce((t,s)=>t+s.amount,0),"CAD")})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-600 mb-1",children:"Pending"}),e.jsx("p",{className:"text-2xl font-bold text-yellow-600",children:x(n.filter(t=>t.status==="pending").reduce((t,s)=>t+s.amount,0),"CAD")})]})]})})]})})}export{Z as default};
