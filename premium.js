(() => {
  'use strict';
  // All values here are illustrative examples, NOT real API data or forecasts.
  const demos = {
    prematch: {
      title: 'PRE-MATCH OVERVIEW', subtitle: 'Example model probabilities',
      numbers: ['48%', '27%', '25%'], labels: ['Home win', 'Draw', 'Away win'],
      insight: 'The home side has the stronger recent attacking trend. This is an example explanation, not a prediction for a real fixture.',
      a: [32,36,30,43,39,48,45,56,52,62,59,66], b: [39,34,43,38,42,37,45,40,38,44,37,40]
    },
    live: {
      title: 'LIVE MOMENTUM', subtitle: 'Example momentum index',
      numbers: ['72', '18', '10'], labels: ['Home pressure', 'Away pressure', 'Neutral'],
      insight: 'Example: the home side has increased its attacking activity over the last 15 minutes. Real momentum requires event-level data and a calibrated model.',
      a: [21,28,35,32,43,49,45,58,67,64,76,83], b: [56,53,47,49,42,36,40,32,29,33,25,19]
    }
  };
  const graph = document.getElementById('demo-chart');
  const lineA = document.getElementById('line-home');
  const lineB = document.getElementById('line-away');
  const makePoints = values => values.map((v, i) => `${18+i*(364/11)},${124-v*1.14}`).join(' ');
  const tabs = [...document.querySelectorAll('[data-pro-tab]')];
  function render(key) {
    const data = demos[key]; if (!data) return;
    tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.proTab === key)));
    document.getElementById('demo-heading').textContent = data.title;
    document.getElementById('demo-subheading').textContent = data.subtitle;
    document.getElementById('demo-insight').textContent = data.insight;
    data.numbers.forEach((n, i) => { document.getElementById('metric-'+i).textContent=n; document.getElementById('metric-label-'+i).textContent=data.labels[i]; });
    if (graph && lineA && lineB) {lineA.setAttribute('points',makePoints(data.a));lineB.setAttribute('points',makePoints(data.b));}
  }
  tabs.forEach(t => t.addEventListener('click', () => render(t.dataset.proTab)));
  render('prematch');
  const form = document.getElementById('premium-waitlist');
  if (form) {
    const status = document.getElementById('premium-status');
    const button = form.querySelector('button[type=submit]');
    form.addEventListener('submit', async e => {
      e.preventDefault(); if (!form.reportValidity()) return;
      button.disabled = true; button.textContent = 'SENDING…'; status.textContent = 'Submitting your request…'; status.dataset.state='';
      try {
        const payload = new FormData(form);
        payload.set('_subject', 'Bettao Intelligence — early access request');
        const res = await fetch('https://formspree.io/f/xwlvrzkl', {method:'POST',body:payload,headers:{Accept:'application/json'}});
        if (!res.ok) throw new Error('Form service returned an error. Please try again.');
        form.reset(); status.textContent='Request received. Thank you! We will contact you if early access becomes available.'; status.dataset.state='success';
      } catch (err) { status.textContent=err.message || 'Could not send your request. Please try again.'; status.dataset.state='error'; }
      finally {button.disabled=false;button.textContent='REQUEST EARLY ACCESS ↗';}
    });
  }
})();
