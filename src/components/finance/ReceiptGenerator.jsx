import React from 'react';
import { schoolConfig } from '../../data/schoolConfig'; // FIXED: Import named export

const ReceiptGenerator = ({ payment, onClose, onPrint }) => {
  if (!payment) return null;

  // Get school info from config
  const schoolInfo = schoolConfig;

  const getTermLabel = (termId) => {
    const terms = {
      'first-term': 'First Term',
      'second-term': 'Second Term',
      'third-term': 'Third Term'
    };
    return terms[termId] || termId;
  };

  const getMethodLabel = (method) => {
    const methods = {
      'cash': 'Cash',
      'transfer': 'Bank Transfer', 
      'pos': 'POS Payment',
      'online': 'Online Payment'
    };
    return methods[method] || method;
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="receipt-generator">
      <div className="receipt-container">
        {/* Receipt Header */}
        <div className="receipt-header">
          <div className="school-info">
            <h2>{schoolInfo.name}</h2>
            <p>{schoolInfo.motto}</p>
            <p>{schoolInfo.address}</p>
            <p>Zone: {schoolInfo.zone}</p>
          </div>
          <div className="receipt-title">
            <h1>OFFICIAL RECEIPT</h1>
            <p>School Fees Payment</p>
          </div>
        </div>

        {/* Receipt Details */}
        <div className="receipt-details">
          <div className="detail-row">
            <span className="label">Receipt No:</span>
            <span className="value">{payment.receiptNumber}</span>
          </div>
          <div className="detail-row">
            <span className="label">Date:</span>
            <span className="value">{new Date(payment.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="detail-row">
            <span className="label">Student Name:</span>
            <span className="value">{payment.studentName}</span>
          </div>
          <div className="detail-row">
            <span className="label">Class:</span>
            <span className="value">{payment.class}</span>
          </div>
          <div className="detail-row">
            <span className="label">Academic Session:</span>
            <span className="value">{new Date().getFullYear()}/{new Date().getFullYear() + 1}</span>
          </div>
          <div className="detail-row">
            <span className="label">Term:</span>
            <span className="value">{getTermLabel(payment.term)}</span>
          </div>
          <div className="detail-row">
            <span className="label">Payment Method:</span>
            <span className="value">{getMethodLabel(payment.paymentMethod)}</span>
          </div>
        </div>

        {/* Payment Amount */}
        <div className="payment-amount">
          <div className="amount-row">
            <span className="label">Amount Paid:</span>
            <span className="value">₦{parseFloat(payment.amount).toLocaleString()}</span>
          </div>
          <div className="amount-row total">
            <span className="label">Total Amount:</span>
            <span className="value">₦{parseFloat(payment.amount).toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Notes */}
        {payment.notes && (
          <div className="payment-notes">
            <p><strong>Notes:</strong> {payment.notes}</p>
          </div>
        )}

        {/* Official Stamps */}
        <div className="official-section">
          <div className="signature">
            <p>_________________________</p>
            <p>Cashier's Signature</p>
          </div>
          <div className="stamp">
            <div className="stamp-box">
              <p>OFFICIAL STAMP</p>
              <p>{schoolInfo.name}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="receipt-footer">
          <p>This is an official computer generated receipt</p>
          <p>No signature required for electronic receipts</p>
        </div>
      </div>

      {/* Actions */}
      <div className="receipt-actions">
        <button onClick={handlePrint} className="print-btn">
          🖨️ Print Receipt
        </button>
        <button onClick={onClose} className="close-btn">
          ❌ Close
        </button>
      </div>

      <style jsx>{`
        .receipt-generator {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }

        .receipt-container {
          background: white;
          border-radius: 10px;
          padding: 30px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .receipt-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 25px;
          border-bottom: 2px solid #333;
          padding-bottom: 15px;
        }

        .school-info h2 {
          margin: 0 0 5px 0;
          font-size: 18px;
          color: #2c3e50;
        }

        .school-info p {
          margin: 2px 0;
          font-size: 12px;
          color: #666;
        }

        .receipt-title h1 {
          margin: 0;
          font-size: 24px;
          color: #2c3e50;
          text-align: right;
        }

        .receipt-title p {
          margin: 5px 0 0 0;
          font-size: 14px;
          color: #666;
          text-align: right;
        }

        .receipt-details {
          margin-bottom: 20px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          padding: 5px 0;
          border-bottom: 1px dashed #ddd;
        }

        .label {
          font-weight: bold;
          color: #333;
        }

        .value {
          color: #2c3e50;
        }

        .payment-amount {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .amount-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .amount-row.total {
          border-top: 2px solid #333;
          padding-top: 8px;
          font-size: 18px;
          font-weight: bold;
          color: #27ae60;
        }

        .payment-notes {
          background: #fff3cd;
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 20px;
          border-left: 4px solid #ffc107;
        }

        .official-section {
          display: flex;
          justify-content: space-between;
          margin: 30px 0;
          padding-top: 20px;
          border-top: 2px solid #333;
        }

        .signature, .stamp {
          text-align: center;
        }

        .stamp-box {
          border: 2px solid #333;
          padding: 10px;
          border-radius: 5px;
          background: #f8f9fa;
        }

        .stamp-box p {
          margin: 2px 0;
          font-size: 12px;
          font-weight: bold;
        }

        .receipt-footer {
          text-align: center;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
        }

        .receipt-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .print-btn, .close-btn {
          padding: 12px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .print-btn {
          background: #27ae60;
          color: white;
        }

        .print-btn:hover {
          background: #219a52;
        }

        .close-btn {
          background: #dc3545;
          color: white;
        }

        .close-btn:hover {
          background: #c82333;
        }

        @media print {
          .receipt-generator {
            position: static;
            background: white;
            padding: 0;
          }
          .receipt-actions {
            display: none;
          }
          .receipt-container {
            box-shadow: none;
            max-height: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ReceiptGenerator;
