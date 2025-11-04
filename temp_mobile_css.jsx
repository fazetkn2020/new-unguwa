        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .fee-payment {
            max-width: 100%;
            margin: 0;
          }

          .payment-header {
            margin-bottom: 20px;
            text-align: center;
          }

          .payment-header h2 {
            font-size: 20px;
          }

          .selection-section {
            padding: 15px;
          }

          .class-select, .student-search {
            max-width: 100%;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .amount-container {
            flex-direction: column;
          }

          .suggest-btn {
            width: 100%;
            margin-top: 8px;
          }

          .payment-form {
            padding: 15px;
          }

          .payment-summary {
            padding: 15px;
          }

          .summary-item {
            flex-direction: column;
            gap: 5px;
            text-align: center;
          }

          .student-list {
            max-height: 150px;
          }

          .student-item {
            padding: 10px;
          }
        }

        /* Small mobile devices */
        @media (max-width: 480px) {
          .payment-header h2 {
            font-size: 18px;
          }

          .payment-header p {
            font-size: 14px;
          }

          .class-selection, .student-selection {
            margin-bottom: 15px;
          }

          .form-group label {
            font-size: 14px;
          }

          .amount-input, .method-select, .term-select, .type-select, .receipt-input {
            font-size: 16px; /* Prevents zoom on iOS */
            padding: 12px;
          }

          .submit-btn {
            padding: 12px;
            font-size: 16px;
          }
        }
