<template>
    <div class="certifications-section text-center" data-aos="fade-up">
      <div class="certification-logos">
        <img src="@/assets/NACB.png" alt="NACB Logo" class="cert-logo">
        <img src="@/assets/Iso14001.png" alt="ISO 14001 Logo" class="cert-logo">
        <img src="@/assets/Iso9001.png" alt="ISO 9001 Logo" class="cert-logo">
        <img src="@/assets/ASME.png" alt="ASME Logo" class="cert-logo">
        <img src="@/assets/ANSI.png" alt="ANSI Logo" class="cert-logo">
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Certifications'
  };
  </script>
  
  <style scoped>
  .certifications-section {
    background-color: #262624;
    padding: 2rem 0;
  }
  
  .certification-logos {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
  }
  
  .cert-logo {
    max-width: 150px;
    height: auto;
    opacity: 0.8;
    transition: opacity 0.3s ease;
  }
  
  .cert-logo:hover {
    opacity: 1;
  }
  </style>
  