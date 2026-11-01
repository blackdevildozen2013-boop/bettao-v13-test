/* BETÃO v13 — НАСТРОЙКИ ТЕСТОВОГО РЕПОЗИТОРИЯ.
 * Тест: реклама появляется при КАЖДОЙ НОВОЙ загрузке главной страницы
 * во ВСЕХ странах, даже если destinationUrl пока пустой.
 * Для клика по рекламе укажите реальную HTTPS-ссылку в destinationUrl.
 * ВАЖНО: testMode:true — только для тестового репозитория!
 */
window.BETTAO_GEO_AD = Object.freeze({
  enabled: true,
  testMode: true,                 // true = показать сразу в любой стране
  targetCountry: 'BR',           // используется только при testMode: false
  destinationUrl: 'https://r1wclcs.com/v3/fortune-tiger?p=0wz8',            // <-- СЮДА ВСТАВИТЬ HTTPS-ССЫЛКУ РЕКЛАМОДАТЕЛЯ
  bannerImage: 'betao-premium-ad-poster.webp',
  mobileBannerImage: 'betao-premium-ad-poster.webp',
  videoFile: 'betao-premium-ad.mp4',
  openInNewTab: false,           // false = переход в том же WebView
  showDelayMs: 0,               // 0 = сразу после загрузки HTML
  frequency: 'page'             // при новом открытии/перезагрузке страницы
});
