/* ==========================================================================
   TwinVest Application Core JavaScript Logic
   ========================================================================== */

class TwinVestApp {
  constructor() {
    // Current Active States
    this.currentScreen = 'splash-screen';
    this.currentTab = 'home';
    this.surveyIndex = 0;

    // Survey Questions Data
    this.surveyQuestions = [
      {
        q: "월급을 받으면 바로 사고 싶은 것이 생기나요?",
        badge: "현재편향 진단",
        key: "presentBias"
      },
      {
        q: "투자 손실이 나면 신경이 오래 쓰이나요?",
        badge: "손실회피 진단",
        key: "lossAversion"
      },
      {
        q: "한 번 정한 저축 금액을 자주 바꾸나요?",
        badge: "현상유지편향 진단",
        key: "statusQuo"
      },
      {
        q: "수익이 나면 더 자신감이 생기나요?",
        badge: "과잉확신 진단",
        key: "overconfidence"
      },
      {
        q: "돈을 목적별로 따로 관리하나요?",
        badge: "심리적회계 진단",
        key: "mentalAccounting"
      }
    ];

    // User Demo Financial & Behavioral State
    this.userData = {
      salary: 3000000,
      currentAsset: 12430000,
      emergencyFund: 2000000,
      loanBalance: 4200000,
      monthlyInvest: 530000,
      autoSavings: 200000,
      scores: {
        presentBias: 75,
        lossAversion: 82,
        overconfidence: 28,
        mentalAccounting: 60,
        statusQuo: 65
      }
    };

    // Parallel Lab Scenarios Configuration
    this.labScenarios = {
      current: {
        id: 'current',
        name: 'Twin A 현재유지',
        theme: 'theme-gray',
        asset10Y: '1억 1,000만원',
        assetNum: 110000000,
        goalProb: '64%',
        riskAbandon: '28%',
        volatility: '18%',
        regretProb: '35%',
        color: '#A0AEC0',
        active: true
      },
      etf: {
        id: 'etf',
        name: 'Twin B ETF유지',
        theme: 'theme-yellow',
        asset10Y: '1억 2,400만원',
        assetNum: 124000000,
        goalProb: '82%',
        riskAbandon: '18%',
        volatility: '14%',
        regretProb: '12%',
        color: '#FFB100',
        active: true
      },
      stock: {
        id: 'stock',
        name: 'Twin C 단일주식',
        theme: 'theme-purple',
        asset10Y: '1억 5,000만원',
        assetNum: 105000000,
        goalProb: '48%',
        riskAbandon: '41%',
        volatility: '32%',
        regretProb: '62%',
        color: '#7B61FF',
        active: true
      },
      spend: {
        id: 'spend',
        name: 'Twin D 소비감소',
        theme: 'theme-green',
        asset10Y: '1억 4,000만원',
        assetNum: 140000000,
        goalProb: '91%',
        riskAbandon: '12%',
        volatility: '12%',
        regretProb: '8%',
        color: '#00B894',
        active: true
      },
      loan: {
        id: 'loan',
        name: 'Twin E 대출상환',
        theme: 'theme-gray',
        asset10Y: '1억 2,800만원',
        assetNum: 128000000,
        goalProb: '85%',
        riskAbandon: '15%',
        volatility: '10%',
        regretProb: '10%',
        color: '#3182CE',
        active: false
      }
    };

    // Chart Instances
    this.fanChartInstance = null;
    this.overlayChartInstance = null;

    // Behavioral Score Explanations
    this.scoreExplanations = {
      'present-bias': {
        title: '현재편향 (Present Bias) 분석',
        badge: '점수: 75점 (높음)',
        desc: '급여 수령 후 3일 내 쇼핑 및 외식 소비 비중이 42%에 달합니다. 먼 미래의 더 큰 보상보다 당장의 즉각적인 지출 보상을 선호하는 경향이 큽니다. 자동 저축 및 선저축 시스템 구축으로 예방할 수 있습니다.'
      },
      'loss-aversion': {
        title: '손실회피 (Loss Aversion) 분석',
        badge: '점수: 82점 (높음)',
        desc: '전체 자산 중 현금 및 예적금 비중이 68%로 높습니다. 이익의 기쁨보다 손실의 고통을 2.5배 이상 크게 느끼기 때문에 변동성이 높은 자산을 기피합니다. 자산 분산(ETF) 중심 접근이 유리합니다.'
      },
      'overconfidence': {
        title: '과잉확신 (Overconfidence) 분석',
        badge: '점수: 28점 (낮음)',
        desc: '최근 12개월간 잦은 단기 매매가 없고 신중한 판단을 유지하고 있습니다. 자신의 예측을 과신하여 고위험 자산에 올인하는 무리한 매매를 하지 않는 긍정적인 특성입니다.'
      },
      'mental-accounting': {
        title: '심리적회계 (Mental Accounting) 분석',
        badge: '점수: 60점 (중간)',
        desc: '비상금 계좌(200만원)와 생활비 계좌를 분리하여 출처와 목적에 따라 돈의 가치를 다르게 부여합니다. 효율적인 자산 배분을 위해 통합 관리가 필요합니다.'
      },
      'status-quo': {
        title: '현상유지편향 (Status Quo Bias) 분석',
        badge: '점수: 65점 (중간)',
        desc: '최근 14개월간 금융 상품 설정이나 자동이체 금액을 변경하지 않고 기존 패턴을 지속하고 있습니다. 정기적인 이율 비교 및 리밸런싱이 추천됩니다.'
      }
    };

    this.init();
  }

  init() {
    this.initSplashParticles();
    this.renderParallelGrid();
    
    // Auto-transition Splash screen after 2.5 seconds if on splash
    setTimeout(() => {
      if (this.currentScreen === 'splash-screen') {
        this.showScreen('onboarding-screen');
      }
    }, 2500);
  }

  // Particle generator for Splash
  initSplashParticles() {
    const container = document.getElementById('splash-particles');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.style.position = 'absolute';
      p.style.width = Math.random() * 6 + 2 + 'px';
      p.style.height = p.style.width;
      p.style.background = '#FFB100';
      p.style.opacity = Math.random() * 0.5 + 0.2;
      p.style.borderRadius = '50%';
      p.style.top = Math.random() * 100 + '%';
      p.style.left = Math.random() * 100 + '%';
      container.appendChild(p);
    }
  }

  // Screen Switcher
  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      this.currentScreen = screenId;
    }

    if (screenId === 'main-app') {
      this.switchTab('home');
    }
  }

  // Onboarding Carousel Slider
  setSlide(index) {
    const slides = document.querySelectorAll('.onboarding-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
  }

  // Answer Behavioral Survey
  answerSurvey(val) {
    this.surveyIndex++;
    if (this.surveyIndex < this.surveyQuestions.length) {
      const qData = this.surveyQuestions[this.surveyIndex];
      document.getElementById('survey-question-text').innerText = qData.q;
      document.querySelector('.survey-badge').innerText = qData.badge;
      document.getElementById('survey-step-indicator').innerText = `${this.surveyIndex + 1} / 5`;
      document.getElementById('survey-progress').style.width = `${((this.surveyIndex + 1) / 5) * 100}%`;
    } else {
      this.startLoadingSimulation();
    }
  }

  // AI Diagnostic Loading Progression
  startLoadingSimulation() {
    this.showScreen('loading-screen');
    const messages = [
      '급여 패턴 분석 중...',
      '소비 타이밍 분석 중...',
      '투자 행동 분석 중...',
      '대출 구조 분석 중...',
      '미래 행동 모델 생성 완료!'
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < 5) {
        document.getElementById('loading-message').innerText = messages[step];
        const stepEl = document.getElementById(`step-${step}`);
        if (stepEl) {
          stepEl.className = 'step-item done';
          stepEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${stepEl.innerText.replace('...', '')}`;
        }
        step++;
        if (step < 5) {
          const nextEl = document.getElementById(`step-${step}`);
          if (nextEl) {
            nextEl.className = 'step-item active';
            nextEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${nextEl.innerText}`;
          }
        }
      } else {
        clearInterval(interval);
        setTimeout(() => {
          this.showScreen('main-app');
        }, 600);
      }
    }, 600);
  }

  // Bottom Navigation Tab Switcher
  switchTab(tabId) {
    this.currentTab = tabId;
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) {
      targetTab.classList.add('active');
    }

    if (tabId === 'home') {
      this.renderHomeFanChart();
      this.animateCountUp();
    } else if (tabId === 'lab') {
      this.renderLabOverlayChart();
    }
  }

  // Animate Count-Up Numbers
  animateCountUp() {
    document.querySelectorAll('.count-up').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      let current = 0;
      const step = Math.ceil(target / 25);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.innerText = (current / 10000).toLocaleString('ko-KR') + '만원';
      }, 30);
    });
  }

  // Render Home Fan Chart (P10, P50, P90)
  renderHomeFanChart() {
    const ctx = document.getElementById('fanChartCanvas');
    if (!ctx) return;

    if (this.fanChartInstance) {
      this.fanChartInstance.destroy();
    }

    this.fanChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['현재', '1년후', '3년후', '5년후', '7년후', '10년후'],
        datasets: [
          {
            label: 'P90 (상위 10%)',
            data: [1243, 1500, 2200, 3100, 4200, 5600],
            borderColor: '#FFB100',
            backgroundColor: 'rgba(255, 177, 0, 0.2)',
            fill: '+1',
            tension: 0.4
          },
          {
            label: 'P50 (기본 예상)',
            data: [1243, 1320, 1850, 2480, 3200, 4100],
            borderColor: '#7B61FF',
            backgroundColor: 'rgba(123, 97, 255, 0.15)',
            fill: '+1',
            tension: 0.4
          },
          {
            label: 'P10 (하위 10%)',
            data: [1243, 1200, 1450, 1800, 2200, 2800],
            borderColor: '#A0AEC0',
            backgroundColor: 'transparent',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            grid: { color: 'rgba(0,0,0,0.03)' },
            ticks: {
              callback: value => value + '만'
            }
          }
        }
      }
    });
  }

  // Toggle Scenario in Lab
  toggleScenario(id) {
    if (this.labScenarios[id]) {
      this.labScenarios[id].active = !this.labScenarios[id].active;
      const btn = document.querySelector(`.preset-btn[data-id="${id}"]`);
      if (btn) btn.classList.toggle('active', this.labScenarios[id].active);
      this.renderParallelGrid();
      this.renderLabOverlayChart();
    }
  }

  // Render 2x2 Parallel Universe Grid
  renderParallelGrid() {
    const grid = document.getElementById('parallel-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const activeList = Object.values(this.labScenarios).filter(s => s.active).slice(0, 4);

    activeList.forEach(s => {
      const card = document.createElement('div');
      card.className = `universe-card ${s.theme}`;
      card.innerHTML = `
        <div class="uni-header">
          <span class="uni-title">${s.name}</span>
          <i class="fa-solid fa-globe" style="color:${s.color}"></i>
        </div>
        <div class="uni-asset">${s.asset10Y}</div>
        <div class="uni-metrics">
          <div class="metric-row"><span>목표 달성률</span><span class="val text-success">${s.goalProb}</span></div>
          <div class="metric-row"><span>중도 포기 위험</span><span class="val text-danger">${s.riskAbandon}</span></div>
          <div class="metric-row"><span>예상 변동성</span><span class="val">${s.volatility}</span></div>
          <div class="metric-row"><span>후회 가능성</span><span class="val">${s.regretProb}</span></div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Render Lab Overlay Multi-Line Chart
  renderLabOverlayChart() {
    const ctx = document.getElementById('overlayChartCanvas');
    if (!ctx) return;

    if (this.overlayChartInstance) {
      this.overlayChartInstance.destroy();
    }

    const datasets = [];
    const activeList = Object.values(this.labScenarios).filter(s => s.active);

    const dataPoints = {
      current: [1243, 1320, 1850, 2480, 3200, 4100],
      etf: [1243, 1400, 2100, 3200, 4800, 6400],
      stock: [1243, 1100, 2400, 1900, 3800, 4500],
      spend: [1243, 1550, 2600, 4100, 6200, 8000],
      loan: [1243, 1450, 2200, 3400, 5000, 6800]
    };

    activeList.forEach(s => {
      datasets.push({
        label: s.name,
        data: dataPoints[s.id] || [1243, 1300, 1800, 2500, 3200, 4000],
        borderColor: s.color,
        borderWidth: 2.5,
        fill: false,
        tension: 0.3
      });
    });

    this.overlayChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['현재', '1년', '3년', '5년', '7년', '10년'],
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            grid: { color: 'rgba(0,0,0,0.03)' },
            ticks: { callback: v => v + '만' }
          }
        }
      }
    });
  }

  // Interactive Custom Sliders Logic with Behavioral Penalty Correction
  updateCustomLab() {
    const spend = parseInt(document.getElementById('slider-spend').value, 10);
    const invest = parseInt(document.getElementById('slider-invest').value, 10);
    const ratio = parseInt(document.getElementById('slider-ratio').value, 10); // ETF %

    document.getElementById('val-spend').innerText = `${spend}만원`;
    document.getElementById('val-invest').innerText = `${invest}만원`;
    document.getElementById('val-ratio').innerText = `ETF ${ratio}% / 주식 ${100 - ratio}%`;

    // Base math: initial 12.43M + (invest * 12 * 10 years) with expected yield
    const baseReturnRate = 1.05 + (ratio * 0.0005) + ((100 - ratio) * 0.0008);
    let estimated = Math.round((1243 + invest * 12 * 10 * 0.12) * baseReturnRate);

    // Behavioral Penalty Correction: High Loss Aversion (82) + High Stock Ratio (> 50%) -> High abandonment risk
    const stockRatio = 100 - ratio;
    const lossAversion = this.userData.scores.lossAversion;
    
    let penaltyNote = "* 높은 손실회피 성향(82)으로 단일주식 비중이 높아지면 중도 포기 위험이 보정 반영됩니다.";
    if (stockRatio > 40 && lossAversion > 70) {
      const penaltyFactor = (stockRatio - 40) * 0.005;
      estimated = Math.round(estimated * (1 - penaltyFactor));
      penaltyNote = `⚠️ 손실회피 성향(${lossAversion}점) 충돌 보정: 하락장 공포로 인한 중도매도 위험이 반영되어 -${Math.round(penaltyFactor * 100)}% 차감되었습니다.`;
    }

    document.getElementById('custom-res-amount').innerText = `${(estimated * 10).toLocaleString('ko-KR')}만원`;
    document.getElementById('custom-res-note').innerText = penaltyNote;
  }

  // Open Behavioral Score Modal Sheet
  openScoreDetail(scoreKey) {
    const info = this.scoreExplanations[scoreKey];
    if (info) {
      document.getElementById('score-modal-title').innerText = info.title;
      document.getElementById('score-modal-badge').innerText = info.badge;
      document.getElementById('score-modal-explanation').innerText = info.desc;
      document.getElementById('score-modal').classList.add('active');
    }
  }

  // Open "Why?" AI Coach Modal Flow Chart
  openWhyModal() {
    document.getElementById('why-modal').classList.add('active');
  }

  // Open Future Letter Postcard
  openLetterModal() {
    document.getElementById('letter-modal').classList.add('active');
  }

  // Show Event Timeline Explanation
  showEventReason(title, text) {
    document.getElementById('event-reason-title').innerText = title;
    document.getElementById('event-reason-text').innerText = text;
    document.getElementById('event-reason-modal').classList.add('active');
  }

  // Close Modal
  closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.remove('active');
  }

  // Save Future Goal (Confetti trigger!)
  saveFutureGoal() {
    this.closeModal('letter-modal');
    if (window.confetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    alert('🎉 2036년의 목표 자산이 성공적으로 저장되었습니다! Twin이 지속적으로 목표 행동을 코칭합니다.');
  }
}

// Global App Instance Initialization
let app;
window.addEventListener('DOMContentLoaded', () => {
  app = new TwinVestApp();
});
