<script setup>
import { ref } from "vue";
import QRCode from "qrcode";
import { QrcodeStream } from "vue-qrcode-reader";

const name = ref("");
const email = ref("");
const qrCodeUrl = ref("");
const isSignedUp = ref(false);
const scannedData = ref("");
const isScanning = ref(false);

const signUp = async () => {
  if (!name.value || !email.value) {
    alert("Please fill in all fields!");
    return;
  }

  const userData = { name: name.value, email: email.value };
  const userString = JSON.stringify(userData);

  try {
    qrCodeUrl.value = await QRCode.toDataURL(userString);
    isSignedUp.value = true;
  } catch (err) {
    console.error("QR Code generation failed:", err);
  }
};

const onDetect = (result) => {
  const scannedText = result[0].rawValue;
  alert(`Scanned Successfully: ${scannedText}`);
  scannedData.value = scannedText; // Ipakita ang scanned data
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

      <div v-if="scannedData" class="scanned-data">
        <h3>Scanned Data:</h3>
        <p>{{ scannedData }}</p>
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

/* Scanned Data */
.scanned-data {
  background: #e8f5e9;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  width: 250px;
  text-align: center;
}
</style>
