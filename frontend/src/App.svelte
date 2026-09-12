<script>
  import './app.css';

  let fullName = '';
  let contact = '';
  let dob = '';
  let tob = '';
  let pob = '';
  
  // Timeframe options: next 3 months, next 1 year, whole life
  let timeframe = 'next_3_months';
  
  // Category options: career, finance, health, overall
  let category = 'career';

  let isLoading = false;
  let predictionResult = null;
  let errorMessage = '';

  const timeframes = [
    { id: 'next_3_months', label: 'Next 3 Months', icon: 'bi-calendar3' },
    { id: 'next_1_year', label: 'Next 1 Year', icon: 'bi-calendar-check' },
    { id: 'whole_life', label: 'Whole Life', icon: 'bi-infinity' }
  ];

  const categories = [
    { id: 'career', label: 'Career', icon: 'bi-briefcase-fill' },
    { id: 'finance', label: 'Finance', icon: 'bi-cash-coin' },
    { id: 'health', label: 'Health', icon: 'bi-heart-pulse-fill' },
    { id: 'overall', label: 'Overall Prediction', icon: 'bi-compass-fill' }
  ];

  async function handleAskJyotish() {
    if (!fullName || !contact || !dob || !tob || !pob) {
      errorMessage = 'Kripya saari details (Name, Contact, DOB, TOB, POB) sahi se bharein.';
      return;
    }

    errorMessage = '';
    isLoading = true;
    predictionResult = null;

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          contact,
          dob,
          tob,
          pob,
          timeframe,
          category
        })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        predictionResult = resData.data;
      } else {
        errorMessage = resData.error || 'Prediction generate karne me issue aaya. Kripya punah prayas karein.';
      }
    } catch (err) {
      errorMessage = 'Server connection error. Kripya backend server check karein.';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="container py-5">
  <!-- Header -->
  <div class="text-center mb-5">
    <div class="d-inline-block p-3 rounded-circle mb-3" style="background: rgba(243, 156, 18, 0.15); border: 2px solid #f1c40f;">
      <span style="font-size: 3rem;">🔮</span>
    </div>
    <h1 class="glow-title display-4">Vedic Jyotish Astrologer</h1>
    <p class="lead text-warning fw-light">
      Authentic Mathematical Planetary Calculations • AI Refined Language
    </p>
  </div>

  <div class="row justify-content-center">
    <div class="col-lg-9">
      <!-- Input Card -->
      <div class="cosmic-card p-4 p-md-5 mb-5">
        <h3 class="glow-title mb-4 border-bottom pb-2 border-warning border-opacity-25">
          <i class="bi bi-person-vcard me-2"></i> User Kundli Details
        </h3>

        {#if errorMessage}
          <div class="alert alert-danger bg-danger bg-opacity-25 text-white border-danger mb-4 d-flex align-items-center">
            <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i> {errorMessage}
          </div>
        {/if}

        <div class="row g-3">
          <div class="col-md-6">
            <label for="fullNameInput" class="form-label form-label-cosmic">Full Name</label>
            <input id="fullNameInput" type="text" class="form-control form-control-cosmic" placeholder="e.g. Siddharth Mishra" bind:value={fullName} />
          </div>

          <div class="col-md-6">
            <label for="contactInput" class="form-label form-label-cosmic">Contact (Mobile / Email)</label>
            <input id="contactInput" type="text" class="form-control form-control-cosmic" placeholder="e.g. +91 9876543210" bind:value={contact} />
          </div>

          <div class="col-md-4">
            <label for="dobInput" class="form-label form-label-cosmic">Date of Birth</label>
            <input id="dobInput" type="date" class="form-control form-control-cosmic" bind:value={dob} />
          </div>

          <div class="col-md-4">
            <label for="tobInput" class="form-label form-label-cosmic">Time of Birth</label>
            <input id="tobInput" type="time" class="form-control form-control-cosmic" bind:value={tob} />
          </div>

          <div class="col-md-4">
            <label for="pobInput" class="form-label form-label-cosmic">Place of Birth</label>
            <input id="pobInput" type="text" class="form-control form-control-cosmic" placeholder="e.g. Varanasi, India" bind:value={pob} />
          </div>
        </div>

        <!-- Section: See Your Future (Timeframe) -->
        <div class="mt-4 pt-3">
          <label class="form-label form-label-cosmic d-block mb-3">
            <i class="bi bi-hourglass-split me-1 text-warning"></i> See Your Future (Timeframe)
          </label>
          <div class="row g-3">
            {#each timeframes as tf}
              <div class="col-md-4">
                <div
                  class="option-card-btn {timeframe === tf.id ? 'active' : ''}"
                  on:click={() => timeframe = tf.id}
                  on:keydown={(e) => e.key === 'Enter' && (timeframe = tf.id)}
                  role="button"
                  tabindex="0"
                >
                  <i class="bi {tf.icon} fs-3 d-block text-warning mb-1"></i>
                  <span class="fw-bold">{tf.label}</span>
                </div>
              </div>
            {/each}
          </div>
        </div>

        <!-- Section: See For (Category) -->
        <div class="mt-4 pt-3">
          <label class="form-label form-label-cosmic d-block mb-3">
            <i class="bi bi-stars me-1 text-warning"></i> See For (Focus Area)
          </label>
          <div class="row g-2 g-md-3">
            {#each categories as cat}
              <div class="col-6 col-md-3">
                <div
                  class="option-card-btn {category === cat.id ? 'active' : ''}"
                  on:click={() => category = cat.id}
                  on:keydown={(e) => e.key === 'Enter' && (category = cat.id)}
                  role="button"
                  tabindex="0"
                >
                  <i class="bi {cat.icon} fs-3 d-block text-warning mb-1"></i>
                  <span class="fw-bold text-nowrap">{cat.label}</span>
                </div>
              </div>
            {/each}
          </div>
        </div>

        <!-- Action Button -->
        <div class="text-center mt-5">
          <button
            class="btn btn-ask-jyotish shadow-lg"
            on:click={handleAskJyotish}
            disabled={isLoading}
          >
            {#if isLoading}
              <span class="spinner-border spinner-border-sm me-2" role="status"></span>
              Consulting Planets...
            {:else}
              <i class="bi bi-magic me-2"></i> Ask Your Jyotish
            {/if}
          </button>
        </div>
      </div>

      <!-- Loader State -->
      {#if isLoading}
        <div class="text-center py-5 cosmic-card my-4">
          <div class="astrology-loader mb-3">☸️</div>
          <h4 class="glow-title">Aligning Vedic Planetary Orbits...</h4>
          <p class="text-secondary">Calculating Sidereal Ayanamsa, Lagna Rashi & AI language refinement</p>
        </div>
      {/if}

      <!-- Result View -->
      {#if predictionResult && !isLoading}
        <div class="prediction-box my-4">
          <div class="d-flex justify-content-between align-items-center border-bottom border-warning border-opacity-50 pb-3 mb-4 flex-wrap gap-2">
            <div>
              <span class="badge-vedic me-2">
                <i class="bi bi-shield-check"></i> Score: {predictionResult.mathResult.meta.mathematicalScore}%
              </span>
              <span class="badge bg-outline-warning text-warning border border-warning">
                {predictionResult.mathResult.meta.categoryLabel} ({predictionResult.mathResult.meta.timeframeLabel})
              </span>
            </div>
            <div class="text-warning small fw-bold">
              <i class="bi bi-geo-alt-fill"></i> {pob}
            </div>
          </div>

          <h3 class="glow-title mb-3">Dear {predictionResult.fullName},</h3>

          <div class="my-3">
            {predictionResult.predictionText}
          </div>

          <div class="mt-4 pt-3 border-top border-secondary text-secondary small">
            <i class="bi bi-info-circle me-1"></i>
            Note: All predictions are derived strictly from mathematical astrological algorithms and refined for clear presentation.
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
