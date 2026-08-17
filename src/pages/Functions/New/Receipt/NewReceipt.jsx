// src/pages/Functions/New/Receipt/NewReceipt.jsx

import { useEffect, useState } from "react";
import "./NewReceipt.scss";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const initialForm = {
  referenceNumber: "",
  recipientName: "",
  engagementFor: "",
  engagementAnd: "",
  amount: "",
  amountInWords: "",
  paymentMode: "",
  bankName: "",
  transactionUtr: "",
  paymentDate: "",
  towards: "",
  narration: "",
  regardsName: "",
  signature: null,
};

export default function NewReceipt() {
  const [employee, setEmployee] = useState(null);
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadEmployee();
  }, []);

  async function loadEmployee() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Authentication required."
        );
      }

      /*
       * Employee ID is deliberately NOT placed
       * anywhere in the receipt.
       *
       * It is internal authentication/reference data.
       */

      if (!data.employee.departments?.includes("Fin")) {
        throw new Error(
          "This function is restricted to Fin employees."
        );
      }

      setEmployee(data.employee);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  function handleSignature(event) {
    const file = event.target.files?.[0] || null;

    setForm((current) => ({
      ...current,
      signature: file,
    }));

    setError("");
    setSuccess("");
  }

  async function generateReceipt(event) {
    event.preventDefault();

    setGenerating(true);
    setError("");
    setSuccess("");

    try {
      if (!form.signature) {
        throw new Error(
          "Please upload the authorized signature."
        );
      }

      const payload = new FormData();

      payload.append(
        "referenceNumber",
        form.referenceNumber
      );

      payload.append(
        "recipientName",
        form.recipientName
      );

      payload.append(
        "engagementFor",
        form.engagementFor
      );

      payload.append(
        "engagementAnd",
        form.engagementAnd
      );

      payload.append(
        "amount",
        form.amount
      );

      payload.append(
        "amountInWords",
        form.amountInWords
      );

      payload.append(
        "paymentMode",
        form.paymentMode
      );

      payload.append(
        "bankName",
        form.bankName
      );

      payload.append(
        "transactionUtr",
        form.transactionUtr
      );

      payload.append(
        "paymentDate",
        form.paymentDate
      );

      payload.append(
        "towards",
        form.towards
      );

      payload.append(
        "narration",
        form.narration
      );

      payload.append(
        "regardsName",
        form.regardsName
      );

      payload.append(
        "signature",
        form.signature
      );

      const response = await fetch(
        `${API_URL}/func/new/receipt`,
        {
          method: "POST",
          credentials: "include",
          body: payload,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to generate receipt."
        );
      }

      setSuccess(
        `Receipt ${data.receipt.referenceNumber} generated successfully.`
      );

    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <main className="NewReceipt">
        <div className="NewReceipt__loading">
          Loading receipt function...
        </div>
      </main>
    );
  }

  return (
    <main className="NewReceipt">

      <header className="NewReceipt__topbar">
        <div>
          <span className="NewReceipt__eyebrow">
            FIN
          </span>

          <h1>
            New Payment Acknowledgement
          </h1>
        </div>

        <div className="NewReceipt__employee">
          <span>Working as</span>
          <strong>{employee?.name}</strong>
        </div>
      </header>


      <div className="NewReceipt__workspace">

        {/* =================================================
            FORM
        ================================================= */}

        <section className="NewReceipt__formPanel">

          <div className="NewReceipt__sectionHeader">
            <span>01</span>

            <div>
              <h2>Payment Acknowledgement</h2>
              <p>
                Complete the fields marked below.
              </p>
            </div>
          </div>


          <form onSubmit={generateReceipt}>

            <div className="NewReceipt__grid">

              <label>
                <span>Reference Number</span>

                <input
                  name="referenceNumber"
                  value={form.referenceNumber}
                  onChange={updateField}
                  placeholder="Huge/PA/2026/00001"
                  required
                />
              </label>


              <label>
                <span>Date</span>

                <input
                  value="13 August 2026"
                  readOnly
                />
              </label>


              <label className="full">
                <span>Dear</span>

                <input
                  name="recipientName"
                  value={form.recipientName}
                  onChange={updateField}
                  placeholder="Recipient name"
                  required
                />
              </label>


              <label>
                <span>Engagement for</span>

                <input
                  name="engagementFor"
                  value={form.engagementFor}
                  onChange={updateField}
                  placeholder="First engagement"
                  required
                />
              </label>


              <label>
                <span>And</span>

                <input
                  name="engagementAnd"
                  value={form.engagementAnd}
                  onChange={updateField}
                  placeholder="Second engagement"
                  required
                />
              </label>


              <label>
                <span>Amount Received</span>

                <input
                  name="amount"
                  value={form.amount}
                  onChange={updateField}
                  placeholder="50000"
                  inputMode="decimal"
                  required
                />
              </label>


              <label>
                <span>Amount in Words</span>

                <input
                  name="amountInWords"
                  value={form.amountInWords}
                  onChange={updateField}
                  placeholder="Fifty Thousand"
                  required
                />
              </label>


              <label>
                <span>Payment Mode</span>

                <input
                  name="paymentMode"
                  value={form.paymentMode}
                  onChange={updateField}
                  placeholder="NEFT"
                  required
                />
              </label>


              <label>
                <span>Bank Name</span>

                <input
                  name="bankName"
                  value={form.bankName}
                  onChange={updateField}
                  placeholder="Bank name"
                  required
                />
              </label>


              <label className="full">
                <span>Transaction / UTR No.</span>

                <input
                  name="transactionUtr"
                  value={form.transactionUtr}
                  onChange={updateField}
                  placeholder="Transaction / UTR number"
                  required
                />
              </label>


              <label>
                <span>Payment Date</span>

                <input
                  type="date"
                  name="paymentDate"
                  value={form.paymentDate}
                  onChange={updateField}
                  required
                />
              </label>


              <label>
                <span>Towards</span>

                <input
                  name="towards"
                  value={form.towards}
                  onChange={updateField}
                  placeholder="Payment purpose"
                  required
                />
              </label>


              <label className="full">
                <span>Narration</span>

                <textarea
                  name="narration"
                  value={form.narration}
                  onChange={updateField}
                  placeholder="Narration"
                  rows="3"
                  required
                />
              </label>


              <label>
                <span>Warm Regards</span>

                <input
                  name="regardsName"
                  value={form.regardsName}
                  onChange={updateField}
                  placeholder="Authorized person's name"
                  required
                />
              </label>


              <label>
                <span>Signature</span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleSignature}
                  required
                />

                {form.signature && (
                  <small>
                    {form.signature.name}
                  </small>
                )}
              </label>

            </div>


            {error && (
              <div className="NewReceipt__message NewReceipt__message--error">
                {error}
              </div>
            )}

            {success && (
              <div className="NewReceipt__message NewReceipt__message--success">
                {success}
              </div>
            )}


            <button
              type="submit"
              className="NewReceipt__generate"
              disabled={generating}
            >
              {generating
                ? "Generating..."
                : "Generate Payment Acknowledgement"}
            </button>

          </form>
        </section>


        {/* =================================================
            EXACT DOCUMENT PREVIEW
        ================================================= */}

        <section className="NewReceipt__previewPanel">

          <div className="NewReceipt__previewBar">
            <span>DOCUMENT PREVIEW</span>

            <span>
              PAYMENT ACKNOWLEDGEMENT
            </span>
          </div>


          <article className="PaymentAcknowledgement">

            <header className="PaymentAcknowledgement__header">

              <div className="PaymentAcknowledgement__brand">
                <strong>Huge</strong>

                <span>
                  A Bamboo
                  <br />
                  Company
                </span>
              </div>

              <div className="PaymentAcknowledgement__tagline">
                Making products and
                <br />
                intelligence for documents
              </div>

              <div className="PaymentAcknowledgement__contact">
                <strong>Digidesk</strong>

                <span>
                  Smart document control for speed and accuracy!
                </span>
              </div>

            </header>


            <h1 className="PaymentAcknowledgement__title">
              PAYMENT ACKNOWLEDGEMENT
            </h1>


            <div className="PaymentAcknowledgement__meta">

              <span>
                Date: 13 August 2026
              </span>

              <span>
                Ref.No.:{" "}
                {form.referenceNumber || "?????"}
              </span>

            </div>


            <div className="PaymentAcknowledgement__body">

              <p>
                Dear{" "}
                <strong>
                  {form.recipientName || "???"}
                </strong>,
              </p>

              <p>
                We acknowledge with thanks the receipt
                of your payment.
              </p>

              <p>
                This payment is towards the engagement
                for{" "}
                <strong>
                  {form.engagementFor || "??"}
                </strong>{" "}
                and{" "}
                <strong>
                  {form.engagementAnd || "??"}
                </strong>{" "}
                related to the Handover of School –
                From Proposal to Final Order.
              </p>

              <p>
                We look forward to continuing our
                association and serving your organization.
              </p>

              <p>
                Thank you for your trust and support.
              </p>


              <h2>
                Payment Detail
              </h2>


              <dl>

                <div>
                  <dt>Amount Received</dt>
                  <dd>
                    ₹
                    {form.amount || "??????"}
                    /-
                  </dd>
                </div>

                <div>
                  <dt>Amount in Words</dt>
                  <dd>
                    Rupees{" "}
                    {form.amountInWords || "???"}
                    {" "}Only
                  </dd>
                </div>

                <div>
                  <dt>Payment Mode</dt>
                  <dd>
                    {form.paymentMode || "??????"}
                  </dd>
                </div>

                <div>
                  <dt>Bank Name</dt>
                  <dd>
                    {form.bankName || "?????"}
                  </dd>
                </div>

                <div>
                  <dt>Transaction/UTR No.</dt>
                  <dd>
                    {form.transactionUtr || "??????????"}
                  </dd>
                </div>

                <div>
                  <dt>Payment Date</dt>
                  <dd>
                    {form.paymentDate || "?????????"}
                  </dd>
                </div>

                <div>
                  <dt>Towards</dt>
                  <dd>
                    {form.towards || "?????"}
                  </dd>
                </div>

                <div>
                  <dt>Narration</dt>
                  <dd>
                    {form.narration || "???"}
                  </dd>
                </div>

              </dl>


              <p className="PaymentAcknowledgement__thanks">
                Thank You for Your Payment!
              </p>


              <p>
                Warm Regards,
              </p>

              <strong>
                {form.regardsName || "????????"}
              </strong>

              <p>
                Finance Department, Huge Company
              </p>


              {form.signature && (
                <div className="PaymentAcknowledgement__signature">
                  <img
                    src={URL.createObjectURL(form.signature)}
                    alt="Authorized signature"
                  />
                </div>
              )}

            </div>


            <footer className="PaymentAcknowledgement__footer">

              <span>
                Huge Billdesk: +91 9156 232 555
              </span>

              <span>
                Huge Filedesk: +91 828 003 1001
                {" | "}
                Huge Helpdesk: +91 915 646 5001
              </span>

            </footer>

          </article>

        </section>

      </div>
    </main>
  );
}