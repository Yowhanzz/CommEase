<script setup>
import { ref } from "vue";
import QRCode from "qrcode";
import { QrcodeStream } from "vue-qrcode-reader";
import { qrService } from "../api/services";

const name = ref("");
const email = ref("");
const qrCodeUrl = ref("");
const isSignedUp = ref(false);
const scannedData = ref("");
const isScanning = ref(false);
const scanResult = ref(null);
const scanError = ref(null);
const currentEventId = ref("1"); // Replace with actual event ID from your context

const signUp = async () => {
  if (!name.value || !email.value) {
    alert("Please fill in all fields!");
    return;
  }

  const userData = { name: name.value, email: email.value };
  const userString = JSON.stringify(userData);

  try {
    qrCodeUrl.value = await QRCode.toDataURL(userString);
    console.log("Generated QR Code URL:", qrCodeUrl.value); // Debug log
    isSignedUp.value = true;
  } catch (err) {
    console.error("QR Code generation failed:", err);
  }
};

const handleQRScan = async (result) => {
  try {
    // Get the raw value from the scan result
    const scannedText = result[0].rawValue;
    console.log("Scanned text:", scannedText); // Debug log

    // Extract user_email_id from the scanned text
    // The scanned text should be in format: numbers@gordoncollege.edu.ph
    const userEmailId = scannedText.split('@')[0];
    
    if (!userEmailId) {
      throw new Error("Invalid QR code format: Could not extract user email ID");
    }

    console.log("Extracted user_email_id:", userEmailId); // Debug log

    // Call the QR service to process the scan
    const response = await qrService.scanQR(currentEventId.value, userEmailId);
    console.log("API Response:", response); // Debug log
    
    scanResult.value = {
      message: response.message,
      status: response.status,
      time: response.time,
      eventStatus: response.event_status
    };
    
    // Show success message
    alert(`Attendance recorded: ${response.message}`);
    
  } catch (error) {
    console.error("QR scan processing failed:", error);
    scanError.value = error.response?.data?.message || error.message || "Failed to process QR code";
    alert(scanError.value);
  }
};

const onDetect = (result) => {
  handleQRScan(result);
};
</script>

<template>
  <div class="container">
    <div v-if="!isSignedUp" class="signup-box">
      <h2>Sign Up</h2>
      <input v-model="name" class="input-field" placeholder="Enter name" />
      <input v-model="email" class="input-field" placeholder="Enter email" />
      <button @click="signUp" class="btn">Sign Up & Get QR</button>
    </div>

    <div v-else class="qr-box">
      <h2>Your QR Code</h2>
      <p>Scan this to get your signup details</p>
      <img :src="qrCodeUrl" alt="User QR Code" class="qr-image" />
    </div>

    <!-- QR Scanner Section -->
    <div class="scanner-section">
      <h2>QR Code Scanner</h2>

      <button v-if="!isScanning" @click="isScanning = true" class="btn">
        Start Scanning
      </button>

      <qrcode-stream v-if="isScanning" @detect="onDetect" class="scanner-box" />

      <div v-if="scanResult" class="scan-result">
        <h3>Scan Result:</h3>
        <p>Status: {{ scanResult.status }}</p>
        <p>Time: {{ scanResult.time }}</p>
        <p>Message: {{ scanResult.message }}</p>
        <p>Event Status: {{ scanResult.eventStatus }}</p>
      </div>

      <div v-if="scanError" class="scan-error">
        <h3>Error:</h3>
        <p>{{ scanError }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Basic container */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
}

/* Signup & QR Box */
.signup-box, .qr-box, .scanner-section {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  margin-bottom: 20px;
}

/* Input fields */
.input-field {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Button */
.btn {
  background: #28a745;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
}

.btn:hover {
  background: #218838;
}

/* QR Image */
.qr-image {
  width: 150px;
  height: 150px;
  margin-top: 10px;
}

/* Scanner Box */
.scanner-box {
  width: 200px !important;
  height: 200px !important;
  border: 2px solid #4a90e2;
  border-radius: 10px;
  margin-top: 10px;
}

/* Scan Result */
.scan-result {
  background: #e8f5e9;
  padding: 15px;
  border-radius: 5px;
  margin-top: 15px;
  width: 100%;
  text-align: left;
}

.scan-error {
  background: #ffebee;
  padding: 15px;
  border-radius: 5px;
  margin-top: 15px;
  width: 100%;
  text-align: left;
  color: #c62828;
}

.scan-result h3, .scan-error h3 {
  margin: 0 0 10px 0;
  font-size: 1.1em;
}

.scan-result p, .scan-error p {
  margin: 5px 0;
  font-size: 0.9em;
}
</style>
