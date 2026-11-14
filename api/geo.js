// Гео-подсказка для страницы пакетов.
// Vercel передаёт город посетителя в заголовке x-vercel-ip-city
// (название в URL-кодировке, латиницей - например "Kazan", "Moscow").
// Отвечаем странице: колонка цен (регион/миллионник) и город по-русски.
// Если город не определился (VPN, сбой, локальный запуск) - отвечаем
// "миллионник": по договорённости с Вадимом в спорном случае показываем
// цену миллионника, чтобы не продешевить.

const MILLIONNIKI = {
  moscow: "Москва",
  "saint petersburg": "Санкт-Петербург",
  novosibirsk: "Новосибирск",
  yekaterinburg: "Екатеринбург",
  kazan: "Казань",
  "nizhny novgorod": "Нижний Новгород",
  chelyabinsk: "Челябинск",
  krasnoyarsk: "Красноярск",
  samara: "Самара",
  ufa: "Уфа",
  "rostov-on-don": "Ростов-на-Дону",
  omsk: "Омск",
  krasnodar: "Краснодар",
  voronezh: "Воронеж",
  perm: "Пермь",
  volgograd: "Волгоград"
};

function razborGoroda(zagolovokGoroda) {
  if (!zagolovokGoroda) {
    return { kolonka: "millionnik", city: "", opredelen: false };
  }
  let lat = "";
  try {
    lat = decodeURIComponent(zagolovokGoroda).toLowerCase().trim();
  } catch (e) {
    lat = String(zagolovokGoroda).toLowerCase().trim();
  }
  if (MILLIONNIKI[lat]) {
    return { kolonka: "millionnik", city: MILLIONNIKI[lat], opredelen: true };
  }
  // Город есть, но не миллионник - это регион. Название вернём как пришло.
  return { kolonka: "region", city: String(zagolovokGoroda), opredelen: Boolean(lat) };
}

module.exports = function obrabotchik(zapros, otvet) {
  const gorod = zapros.headers["x-vercel-ip-city"] || "";
  const itog = razborGoroda(Array.isArray(gorod) ? gorod[0] : gorod);
  otvet.setHeader("Cache-Control", "no-store");
  otvet.status(200).json(itog);
};

// Для локальных проверок без Vercel
module.exports.razborGoroda = razborGoroda;
module.exports.MILLIONNIKI = MILLIONNIKI;
