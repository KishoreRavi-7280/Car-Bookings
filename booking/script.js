// BMW models web3formsAccessKey = '02465c3b-d080-4f1a-a083-f8626172519c'
//6Lfpj-srAAAAADTfa1EaxzS4_CGvPrq6RbOg9u7r site
//6Lfpj-srAAAAAAW2sLSWEpCHuBkN1SxXlqiHiYNE secret
//fast2smsAPIKey = 'Gbt3DrvlwN17LTWV2jZxouaKgnQPhdzcfReEpXFUSY6k8HB9C5schQd1UC3SARIiKB6Ew0YnjzJZTFvL


const models = {
  "X Series": ["X5 Drive40i","X5 Plug-in","X5 M Competition"],
  "M Series": ["M3 Sedan","M4 Coupe","M5 Hurricane RR","M3 Competition"]
};

// Dynamic Model Dropdown
document.getElementById("series").addEventListener("change", function() {
  const modelSelect = document.getElementById("model");
  modelSelect.innerHTML = '<option value="">Select</option>';
  if(models[this.value]) {
    models[this.value].forEach(model => {
      const opt = document.createElement("option");
      opt.value = model;
      opt.textContent = model;
      modelSelect.appendChild(opt);
    });
  }
});

// Form Submit
document.getElementById("bmwBookingForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const contact = document.getElementById("contact").value;
  const address = document.getElementById("address").value;
  const series = document.getElementById("series").value;
  const model = document.getElementById("model").value;
  const pickup = document.getElementById("pickup").value;
  const dropoff = document.getElementById("dropoff").value;

  // =========================
  // 1️⃣ Send Email via Web3Forms
  // =========================
  const web3formsAccessKey = '02465c3b-d080-4f1a-a083-f8626172519c';
  const emailData = {
    access_key: web3formsAccessKey,
    subject: `New BMW Booking from ${name}`,
    from_name: name,
    from_email: email,
    message: `Booking Details:
Name: ${name}
Email: ${email}
Contact: ${contact}
Address: ${address}
Series: ${series}
Model: ${model}
Pickup: ${pickup}
Dropoff: ${dropoff}`
  };

  try {
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });
  } catch(err) {
    console.error('Email submission failed:', err);
  }

  // =========================
  // 2️⃣ Send SMS via Fast2SMS to customer
  // =========================
  const fast2smsAPIKey = 'vtbQkW0FIk1bXR7h7ZLmrywsNER2H2fcjC8K7tYL6JfYdbPXPLDzFhUjDA0j';
  const message = `🏁 BMW Booking Confirmed!
Hello ${name},

Thank you for choosing BMW. Your booking is confirmed.

📌 Booking Details:
Series: ${series}
Model: ${model}
Pickup: ${pickup}
Dropoff: ${dropoff}

Address: ${address}

We look forward to serving you! 🚗💨
Track Booking: https://yourcompany.com/track-booking`;

  try {
    const smsResponse = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': 'vtbQkW0FIk1bXR7h7ZLmrywsNER2H2fcjC8K7tYL6JfYdbPXPLDzFhUjDA0j',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender_id: "FSTSMS",
        route: "p",
        language: "english",
        numbers: contact,
        message: message
      })
    });
    const result = await smsResponse.json();
    console.log('SMS result:', result);
  } catch(err) {
    console.error('SMS sending failed:', err);
  }

  // =========================
  // 3️⃣ Confirmation to user
  // =========================
  alert('Booking successful! Confirmation SMS sent to your contact.');
  window.location.href = '../booking/thankyou.html';
});
