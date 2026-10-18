import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Analytics } from "@vercel/analytics/react";




/* =========================================================
   INITIAL DATA
========================================================= */

const initialData = {
  certificateNo: "",

  registrationNo: "",
  registrationYear: "",
  chassisNo: "",
  engineNo: "",
  makerModel: "",
  rtoCode: "",

  ownerName: "",
  mobile: "",
  ownerAddress: "",

  sldModel: "",
  tacNo: "",
  copNo: "",
  sldSerialNo: "",
  rotorSealNo: "NA",
  invoiceNo: "",
  testReportNo: "",

  installationDate: new Date()
    .toISOString()
    .slice(0, 10),

  invoiceDate: new Date()
    .toISOString()
    .slice(0, 10),

  speed: "80",
  renewalDate: "",

  installedBy: "",
  installerAddress: "",

  rcPhoto: "",
  vehiclePhoto1: "",
  vehiclePhoto2: "",
};


/* =========================================================
   COPIES
========================================================= */

const copies = [
  "Manufacturer Copy",
  "Dealer/Distributor Copy",
  "Customer Copy",
  "Department Copy",
];


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(value) {
  if (!value) return "";

  const parts = value.split("-");

  if (parts.length !== 3) {
    return value;
  }

  const [year, month, day] = parts;

  return `${day}-${month}-${year}`;
}


/* =========================================================
   RENEWAL DATE
========================================================= */

function calculateRenewal(date) {
  if (!date) return "";

  const d = new Date(`${date}T00:00:00`);

  d.setFullYear(d.getFullYear() + 1);
  d.setDate(d.getDate() - 1);

  return d.toISOString().slice(0, 10);
}


/* =========================================================
   CERTIFICATE NUMBER
========================================================= */

function nextCertificateNumber() {
  const key = "certificate-next-number";

  const current = Number(
    localStorage.getItem(key) || "226602"
  );

  localStorage.setItem(
    key,
    String(current + 1)
  );

  return String(current);
}


/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  ...props
}) {
  return (
    <label className="field">

      <span>
        {label}

        {required && (
          <b> *</b>
        )}
      </span>

      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        required={required}
        {...props}
      />

    </label>
  );
}


/* =========================================================
   SECTION
========================================================= */

function Section({
  title,
  children,
}) {
  return (
    <section className="form-section">

      <h2>{title}</h2>

      <div className="grid">
        {children}
      </div>

    </section>
  );
}


/* =========================================================
   IMAGE UPLOAD
========================================================= */

function ImageUpload({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div className="image-upload-field">

      <label className="field full">

        <span>
          {label}
        </span>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            onChange(e, name)
          }
        />

      </label>

      {value && (
        <div className="upload-preview">

          <img
            src={value}
            alt={label}
          />

          <button
            type="button"
            className="remove-image"
            onClick={() =>
              onChange(null, name)
            }
          >
            Remove Image
          </button>

        </div>
      )}

    </div>
  );
}


/* =========================================================
   CERTIFICATE PAGE
========================================================= */

function CertificatePage({
  data,
  copy,
}) {

  /* =======================================================
     QR CONTENT
  ======================================================= */

  const qrData = [
    `Certificate No.: ${data.certificateNo || ""}`,

    `Registration No.: ${
      data.registrationNo || ""
    }`,

    `Registration Year: ${
      data.registrationYear || ""
    }`,

    `Chassis No.: ${
      data.chassisNo || ""
    }`,

    `Engine No.: ${
      data.engineNo || ""
    }`,

    `Maker / Model: ${
      data.makerModel || ""
    }`,

    `RTO Code: ${
      data.rtoCode || ""
    }`,

    `Owner Name: ${
      data.ownerName || ""
    }`,

    `Mobile: ${
      data.mobile || ""
    }`,

    `Owner Address: ${
      data.ownerAddress || ""
    }`,

    `SLD Model: ${
      data.sldModel || ""
    }`,

    `TAC No.: ${
      data.tacNo || ""
    }`,

    `COP No.: ${
      data.copNo || ""
    }`,

    `SLD Serial No.: ${
      data.sldSerialNo || ""
    }`,

    `Rotor Seal No.: ${
      data.rotorSealNo || ""
    }`,

    `Invoice No.: ${
      data.invoiceNo || ""
    }`,

    `Test Report No.: ${
      data.testReportNo || ""
    }`,

    `Installation Date: ${
      formatDate(data.installationDate)
    }`,

    `Invoice Date: ${
      formatDate(data.invoiceDate)
    }`,

    `Speed: ${
      data.speed || ""
    }`,

    `Renewal Date: ${
      formatDate(data.renewalDate)
    }`,

    `Installed By: ${
      data.installedBy || ""
    }`,

    `Installer Address: ${
      data.installerAddress || ""
    }`,

    `Company Address: Gali no11, kadipur Industrial Area, gurugram, Haryana`,
  ].join("\n");


  return (
    <div
      className="certificate-page"
      id={`certificate-${copy.replace(
        /\W/g,
        "-"
      )}`}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="certificate-header">

        <div className="brand">

          <div className="logo-box">
            SYN
          </div>

          <div>

            <div className="company">
              SYN AUTO SOLUTIONS PVT. LTD.
            </div>

            <div className="iso">
              (AN ISO 9001:2015 Certified Company)
            </div>

          </div>

        </div>


        <div className="title-area">

          <div className="doc-title">
            Fitment Certificate
          </div>

          <div className="copy-label">
            {copy}
          </div>

        </div>

      </header>


      {/* =================================================
          CERTIFICATE NUMBER
      ================================================= */}

      <div className="certificate-no">

        <strong>
          Fitment Certificate No.:
        </strong>{" "}

        {data.certificateNo}

      </div>


      {/* =================================================
          VEHICLE + QR
      ================================================= */}

      <div className="vehicle-qr-layout">


        {/* VEHICLE DETAILS */}

        <div className="cert-section vehicle-details-section">

          <h3>
            Vehicle Details
          </h3>

          <div className="cert-grid">

            <div>
              <b>Registration No.:</b>
              <span>
                {data.registrationNo}
              </span>
            </div>

            <div>
              <b>Registration Year:</b>
              <span>
                {data.registrationYear}
              </span>
            </div>

            <div>
              <b>Chassis No.:</b>
              <span>
                {data.chassisNo}
              </span>
            </div>

            <div>
              <b>Engine No.:</b>
              <span>
                {data.engineNo}
              </span>
            </div>

            <div>
              <b>Maker / Model:</b>
              <span>
                {data.makerModel}
              </span>
            </div>

            <div>
              <b>RTO Code:</b>
              <span>
                {data.rtoCode}
              </span>
            </div>

          </div>

        </div>


        {/* QR */}

        <div className="qr-box">

          <h3>
            QR Code
          </h3>

          <div className="qr-box-content">

            <QRCodeSVG
              value={qrData}
              size={112}
              level="M"
              includeMargin={false}
            />

          </div>

        </div>

      </div>


      {/* =================================================
          VEHICLE OWNER DETAILS
      ================================================= */}

      <div className="cert-section">

        <h3>
          Vehicle Owner Details
        </h3>

        <div className="owner-grid">

          <div>
            <b>Name:</b>
            <span>
              {data.ownerName}
            </span>
          </div>

          <div>
            <b>Mobile:</b>
            <span>
              {data.mobile}
            </span>
          </div>

          <div className="address">
            <b>Address:</b>
            <span>
              {data.ownerAddress}
            </span>
          </div>

        </div>

      </div>


      {/* =================================================
          SLD DETAILS
          INSTALLER DETAILS INSIDE SLD
      ================================================= */}

      <div className="cert-section">

        <h3>
          SLD Details
        </h3>

        <div className="cert-grid">

          <div>
            <b>Model:</b>
            <span>
              {data.sldModel}
            </span>
          </div>

          <div>
            <b>TAC No.:</b>
            <span>
              {data.tacNo}
            </span>
          </div>

          <div>
            <b>COP No.:</b>
            <span>
              {data.copNo}
            </span>
          </div>

          <div>
            <b>SLD Serial No.:</b>
            <span>
              {data.sldSerialNo}
            </span>
          </div>

          <div>
            <b>Rotor Seal No.:</b>
            <span>
              {data.rotorSealNo}
            </span>
          </div>

          <div>
            <b>Invoice No.:</b>
            <span>
              {data.invoiceNo}
            </span>
          </div>

          <div>
            <b>Test Report No.:</b>
            <span>
              {data.testReportNo}
            </span>
          </div>

          <div>
            <b>Installation Date:</b>
            <span>
              {formatDate(
                data.installationDate
              )}
            </span>
          </div>

          <div>
            <b>Invoice Date:</b>
            <span>
              {formatDate(
                data.invoiceDate
              )}
            </span>
          </div>

          <div>
            <b>Speed:</b>
            <span>
              {data.speed}
            </span>
          </div>

          <div>
            <b>Renewal Date:</b>
            <span>
              {formatDate(
                data.renewalDate
              )}
            </span>
          </div>

          {/* INSTALLED BY */}

          <div className="installer-details-cell">

            <b>
              Installed By:
            </b>

            <span>
              {data.installedBy}
            </span>

          </div>

          {/* INSTALLER ADDRESS */}

          <div className="installer-details-cell installer-address-cell">

            <b>
              Installer Address:
            </b>

            <span>
              {data.installerAddress}
            </span>

          </div>

        </div>

      </div>


      {/* =================================================
          DECLARATION
          IMMEDIATELY BELOW SLD DETAILS
      ================================================= */}

      <div className="certificate-bottom">

        <div className="declaration-box">

          <h3>
            Declaration
          </h3>

          <p className="declaration">

            This is to acknowledge that we have got
            our vehicle bearing registration No.
            <b>
              {" "}
              {data.registrationNo}
            </b>{" "}
            fitted with Speed Limitation Device
            Manufactured by M/s. SYN Auto Solutions
            PVT. LTD bearing Sr.No.
            <b>
              {" "}
              {data.sldSerialNo}
            </b>
            . We have checked the performance of
            the vehicle after fitment of the said
            Speed Limitation Device and we confirm
            that the speed of the vehicle is set to
            <b>
              {" "}
              {data.speed} KmpH
            </b>{" "}
            and functioning as per norms laid out
            in AIS018. We are satisfied with the
            performance of the unit in all respects.
            We undertake not to raise any dispute
            or any legal claims against M/s. SYN Auto
            Solutions PVT. LTD in the event that the
            above mentioned seals are found broken/
            tampered and more specifically with respect
            to any variance in the speed limit set at
            the time of delivery, after expiry of
            warranty period of 12 months from the date
            of installation.

          </p>

        </div>


        {/* =================================================
            PHOTOS
            STAY AT BOTTOM
        ================================================= */}

        <div className="photo-section">

          <div className="photo-section-title">
            RC &amp; Vehicle Photos
          </div>

          <div className="photo-grid">


            {/* RC */}

            <div className="photo-box">

              <div className="photo-title">
                RC Photo 1
              </div>

              {data.rcPhoto ? (

                <img
                  src={data.rcPhoto}
                  alt="RC"
                  className="certificate-photo"
                />

              ) : (

                <div className="empty-photo">
                  RC Photo 1
                </div>

              )}

            </div>


            {/* VEHICLE PHOTO 1 */}

            <div className="photo-box">

              <div className="photo-title">
                RC Photo 2
              </div>

              {data.vehiclePhoto1 ? (

                <img
                  src={data.vehiclePhoto1}
                  alt="Vehicle 1"
                  className="certificate-photo"
                />

              ) : (

                <div className="empty-photo">
                  RC Photo 2
                </div>

              )}

            </div>


            {/* VEHICLE PHOTO 2 */}

            <div className="photo-box">

              <div className="photo-title">
                Vehicle Photo 
              </div>

              {data.vehiclePhoto2 ? (

                <img
                  src={data.vehiclePhoto2}
                  alt="Vehicle 2"
                  className="certificate-photo"
                />

              ) : (

                <div className="empty-photo">
                  Vehicle Photo 
                </div>

              )}

            </div>

          </div>

        </div>


        {/* =================================================
            COMPANY ADDRESS
        ================================================= */}

        <footer>

          Gali no11, kadipur Industrial Area,
          gurugram, Haryana

        </footer>

      </div>

    </div>
  );
}


/* =========================================================
   MAIN APP
========================================================= */

export default function App() {

  const [data, setData] =
    useState({
      ...initialData,
      renewalDate:
        calculateRenewal(
          initialData.installationDate
        ),
    });

  const [generating, setGenerating] =
    useState(false);

  const [message, setMessage] =
    useState("");


  /* =======================================================
     CHANGE
  ======================================================= */

  function handleChange(e) {

    const {
      name,
      value,
    } = e.target;

    setData((prev) => {

      const next = {
        ...prev,
        [name]: value,
      };

      if (
        name === "installationDate"
      ) {

        next.renewalDate =
          calculateRenewal(value);

      }

      return next;

    });
  }


  /* =======================================================
     IMAGE CHANGE
  ======================================================= */

  function handleImageChange(
    e,
    fieldName
  ) {

    if (!e) {

      setData((prev) => ({
        ...prev,
        [fieldName]: "",
      }));

      return;
    }

    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      alert(
        "Please select an image file."
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {

      setData((prev) => ({
        ...prev,
        [fieldName]:
          reader.result,
      }));

    };

    reader.readAsDataURL(file);
  }


  /* =======================================================
     RESET
  ======================================================= */

  function reset() {

    const today =
      new Date()
        .toISOString()
        .slice(0, 10);

    setData({
      ...initialData,

      installationDate:
        today,

      invoiceDate:
        today,

      renewalDate:
        calculateRenewal(today),
    });

    setMessage("");
  }


  /* =======================================================
     GENERATE PDF
  ======================================================= */

  async function generatePDF() {

    let certificateNumber =
      data.certificateNo;


    if (!certificateNumber) {

      certificateNumber =
        nextCertificateNumber();

      setData((prev) => ({
        ...prev,

        certificateNo:
          certificateNumber,
      }));

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            200
          )
      );
    }


    setGenerating(true);

    setMessage("");


    try {

      const pdf =
        new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
          compress: true,
        });


      for (
        let i = 0;
        i < copies.length;
        i++
      ) {

        const id =
          `certificate-${copies[
            i
          ].replace(/\W/g, "-")}`;


        const element =
          document.getElementById(id);


        if (!element) {
          continue;
        }


        /* Wait for images */

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              200
            )
        );


        const canvas =
          await html2canvas(
            element,
            {
              scale: 2,

              useCORS: true,

              allowTaint: false,

              backgroundColor:
                "#ffffff",

              logging: false,

              imageTimeout: 15000,

              scrollX: 0,

              scrollY: 0,
            }
          );


        const image =
          canvas.toDataURL(
            "image/png"
          );


        const pageWidth = 210;
        const pageHeight = 297;

        const margin = 4;

        const usableWidth =
          pageWidth -
          margin * 2;

        const usableHeight =
          pageHeight -
          margin * 2;


        let imageWidth =
          usableWidth;

        let imageHeight =
          (canvas.height *
            imageWidth) /
          canvas.width;


        if (
          imageHeight >
          usableHeight
        ) {

          imageHeight =
            usableHeight;

          imageWidth =
            (canvas.width *
              imageHeight) /
            canvas.height;

        }


        const x =
          (pageWidth -
            imageWidth) /
          2;

        const y =
          (pageHeight -
            imageHeight) /
          2;


        if (i > 0) {
          pdf.addPage();
        }


        pdf.addImage(
          image,
          "PNG",
          x,
          y,
          imageWidth,
          imageHeight
        );

      }


      pdf.save(
        `Fitment-Certificate-${
          certificateNumber ||
          "draft"
        }.pdf`
      );


      setMessage(
        "PDF generated successfully."
      );

    } catch (error) {

      console.error(
        "PDF generation error:",
        error
      );

      setMessage(
        "PDF generation failed. Check browser console."
      );

    } finally {

      setGenerating(false);

    }
  }


  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <>
    <main className="app">


      {/* =================================================
          TOPBAR
      ================================================= */}

      <div className="topbar">

        <div>

          <h1>
            Fitment Certificate Generator
          </h1>

          <p>
            Enter details and upload RC
            and vehicle photos.
          </p>

        </div>


        <div className="actions">

          <button
            type="button"
            className="secondary"
            onClick={reset}
          >
            Reset
          </button>

          <button
            type="button"
            className="primary"
            onClick={generatePDF}
            disabled={generating}
          >

            {generating
              ? "Generating..."
              : "Generate PDF"}

          </button>

        </div>

      </div>


      {/* =================================================
          LAYOUT
      ================================================= */}

      <div className="layout">


        {/* =================================================
            FORM
        ================================================= */}

        <form
          className="form-card"
          onSubmit={(e) => {
            e.preventDefault();
            generatePDF();
          }}
        >


          {/* CERTIFICATE */}

          <Section title="Certificate">

            <Field
              label="Certificate No."
              name="certificateNo"
              value={
                data.certificateNo
              }
              onChange={
                handleChange
              }
              placeholder="Auto-generated if blank"
            />

          </Section>


          {/* VEHICLE */}

          <Section title="Vehicle Details">

            <Field
              label="Registration No."
              name="registrationNo"
              value={
                data.registrationNo
              }
              onChange={
                handleChange
              }
              required
            />

            <Field
              label="Registration Year"
              name="registrationYear"
              value={
                data.registrationYear
              }
              onChange={
                handleChange
              }
              type="number"
            />

            <Field
              label="Chassis No."
              name="chassisNo"
              value={
                data.chassisNo
              }
              onChange={
                handleChange
              }
            />

            <Field
              label="Engine No."
              name="engineNo"
              value={
                data.engineNo
              }
              onChange={
                handleChange
              }
            />

            <Field
              label="Maker / Model"
              name="makerModel"
              value={
                data.makerModel
              }
              onChange={
                handleChange
              }
            />

            <Field
              label="RTO Code"
              name="rtoCode"
              value={
                data.rtoCode
              }
              onChange={
                handleChange
              }
            />

          </Section>


          {/* OWNER */}

          <Section title="Vehicle Owner Details">

            <Field
              label="Name"
              name="ownerName"
              value={
                data.ownerName
              }
              onChange={
                handleChange
              }
            />

            <Field
              label="Mobile"
              name="mobile"
              value={
                data.mobile
              }
              onChange={
                handleChange
              }
              type="tel"
            />

            <label className="field full">

              <span>
                Address
              </span>

              <textarea
                name="ownerAddress"
                value={
                  data.ownerAddress
                }
                onChange={
                  handleChange
                }
                rows="3"
              />

            </label>

          </Section>


          {/* SLD */}

          <Section title="SLD Details">

            <Field
              label="Model"
              name="sldModel"
              value={
                data.sldModel
              }
              onChange={
                handleChange
              }
            />

            <Field
              label="TAC No."
              name="tacNo"
              value={
                data.tacNo
              }
              onChange={
                handleChange
              }
            />

            <Field
              label="COP No."
              name="copNo"
              value={
                data.copNo
              }
              onChange={
                handleChange
              }
            />

            <Field
              label="SLD Serial No."
              name="sldSerialNo"
              value={
                data.sldSerialNo
              }
              onChange={
                handleChange
              }
            />

            <Field
              label="Rotor Seal No."
              name="rotorSealNo"
              value={
                data.rotorSealNo
              }
              onChange={
                handleChange
              }
            />

            <Field
              label="Invoice No."
              name="invoiceNo"
              value={
                data.invoiceNo
              }
              onChange={
                handleChange
              }
            />

            <Field
              label="Test Report No."
              name="testReportNo"
              value={
                data.testReportNo
              }
              onChange={
                handleChange
              }
            />

            <Field
              label="Installation Date"
              name="installationDate"
              value={
                data.installationDate
              }
              onChange={
                handleChange
              }
              type="date"
            />

            <Field
              label="Invoice Date"
              name="invoiceDate"
              value={
                data.invoiceDate
              }
              onChange={
                handleChange
              }
              type="date"
            />

            <Field
              label="Speed (KmpH)"
              name="speed"
              value={
                data.speed
              }
              onChange={
                handleChange
              }
              type="number"
            />

            <Field
              label="Renewal Date"
              name="renewalDate"
              value={
                data.renewalDate
              }
              onChange={
                handleChange
              }
              type="date"
            />

          </Section>


          {/* INSTALLER */}

          <Section title="Installer Details">

            <Field
              label="Installed By"
              name="installedBy"
              value={
                data.installedBy
              }
              onChange={
                handleChange
              }
            />

            <label className="field full">

              <span>
                Installer Address
              </span>

              <textarea
                name="installerAddress"
                value={
                  data.installerAddress
                }
                onChange={
                  handleChange
                }
                rows="3"
              />

            </label>

          </Section>


          {/* PHOTOS */}

          <Section title="RC & Vehicle Photos">

            <ImageUpload
              label="RC Photo"
              name="rcPhoto"
              value={
                data.rcPhoto
              }
              onChange={
                handleImageChange
              }
            />

            <ImageUpload
              label="Vehicle Photo 1"
              name="vehiclePhoto1"
              value={
                data.vehiclePhoto1
              }
              onChange={
                handleImageChange
              }
            />

            <ImageUpload
              label="Vehicle Photo 2"
              name="vehiclePhoto2"
              value={
                data.vehiclePhoto2
              }
              onChange={
                handleImageChange
              }
            />

          </Section>


          {/* QR NOTE */}

          <div className="verification-note">

            <b>
              QR Code:
            </b>

            <span>
              Scanning the QR code shows
              all certificate, vehicle,
              owner, SLD and installer
              details.
            </span>

          </div>


          {message && (
            <div className="message">
              {message}
            </div>
          )}

        </form>


        {/* =================================================
            LIVE PREVIEW
        ================================================= */}

        <div className="preview">

          <div className="preview-title">

            <h2>
              Live Preview
            </h2>

            <span>
              4 PDF pages
            </span>

          </div>


          <div className="preview-stack">

            {copies.map(
              (copy) => (

                <CertificatePage
                  key={copy}
                  data={data}
                  copy={copy}
                />

              )
            )}

          </div>

        </div>

      </div>

    </main>
    <Analytics />
    </>
  );
}
