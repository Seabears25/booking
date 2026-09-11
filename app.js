/*
  GitHub Pages configuration
  --------------------------
  Add your preferred delivery method before publishing:
  - BUSINESS_EMAIL: your inbox for booking requests (e.g. "you@example.com")
  - BOOKING_URL: optional external scheduler (Google Calendar, Calendly, etc.)

  The site works without either value as a request builder: visitors can still
  complete the flow and copy the prepared request.
*/
const CONFIG = {
  BUSINESS_EMAIL: "",
  BOOKING_URL: "",
};

const form = document.querySelector("#booking-form");
const successPanel = document.querySelector("#success-panel");
const sendButton = document.querySelector("#send-request");
const copyButton = document.querySelector("#copy-request");
const resetButton = document.querySelector("#reset-form");
const dateInput = document.querySelector("#date");
const steps = [...document.querySelectorAll(".form-step")];
const progressSteps = [...document.querySelectorAll(".progress-step")];
let currentStep = 1;
let requestText = "";

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
dateInput.min = today.toISOString().split("T")[0];

document.querySelector("#year").textContent = new Date().getFullYear();

function setStep(nextStep) {
  currentStep = nextStep;
  steps.forEach((step) => step.classList.toggle("active", Number(step.dataset.step) === nextStep));
  progressSteps.forEach((step) => step.classList.toggle("active", Number(step.dataset.progress) <= nextStep));
}

function showError(key, visible) {
  const error = document.querySelector(`[data-error="${key}"]`);
  if (error) error.classList.toggle("show", visible);
}

function selectedService() {
  return form.querySelector('input[name="service"]:checked')?.value || "";
}

function validateStep(step) {
  if (step === 1) {
    const valid = Boolean(selectedService());
    showError("service", !valid);
    return valid;
  }
  if (step === 2) {
    const valid = Boolean(dateInput.value && form.time.value);
    showError("datetime", !valid);
    return valid;
  }
  const valid = Boolean(form.name.value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value.trim()));
  showError("details", !valid);
  return valid;
}

document.querySelectorAll(".next-button").forEach((button) => {
  button.addEventListener("click", () => {
    if (validateStep(currentStep)) setStep(Math.min(3, currentStep + 1));
  });
});

document.querySelectorAll(".back-button").forEach((button) => {
  button.addEventListener("click", () => setStep(Math.max(1, currentStep - 1)));
});

function readableDate(value) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));
}

function buildRequest() {
  const data = new FormData(form);
  const name = data.get("name").trim();
  const service = data.get("service");
  const date = readableDate(data.get("date"));
  const time = data.get("time");
  const message = data.get("message").trim() || "No additional project notes were provided.";
  return `Hi Joey,\n\nI’d like to talk about a ${service.toLowerCase()} project.\n\nPreferred time: ${date} at ${time}\nName: ${name}\nEmail: ${data.get("email")}\n\nProject notes:\n${message}\n\nThanks!`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateStep(3)) return;
  requestText = buildRequest();
  form.hidden = true;
  document.querySelector(".progress").hidden = true;
  successPanel.hidden = false;
  if (!CONFIG.BUSINESS_EMAIL) {
    sendButton.textContent = "Copy request instead";
    document.querySelector("#success-copy").textContent = "Your request is ready. Add an inbox in app.js before publishing, or copy the prepared message below.";
  }
});

sendButton.addEventListener("click", () => {
  if (!CONFIG.BUSINESS_EMAIL) {
    navigator.clipboard?.writeText(requestText);
    sendButton.textContent = "Request copied ✓";
    return;
  }
  const subject = encodeURIComponent(`New project conversation request — ${form.name.value}`);
  window.location.href = `mailto:${CONFIG.BUSINESS_EMAIL}?subject=${subject}&body=${encodeURIComponent(requestText)}`;
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(requestText);
    copyButton.textContent = "Copied ✓";
    setTimeout(() => { copyButton.textContent = "Copy request"; }, 1800);
  } catch {
    window.prompt("Copy your request:", requestText);
  }
});

resetButton.addEventListener("click", () => {
  form.reset();
  form.hidden = false;
  document.querySelector(".progress").hidden = false;
  successPanel.hidden = true;
  sendButton.innerHTML = "Open email app <span>↗</span>";
  document.querySelector("#success-copy").textContent = "Your request has been prepared. Use the buttons below to send it or copy it for your records.";
  document.querySelectorAll(".form-error").forEach((error) => error.classList.remove("show"));
  setStep(1);
});

if (CONFIG.BOOKING_URL) {
  document.querySelectorAll('a[href="#booking"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      if (link.classList.contains("nav-cta")) {
        event.preventDefault();
        window.open(CONFIG.BOOKING_URL, "_blank", "noopener,noreferrer");
      }
    });
  });
}
