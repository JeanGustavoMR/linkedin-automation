import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';
import generateMessage from '../services/llamaService.js';

dotenv.config();
puppeteer.use(StealthPlugin());

// Configurações e constantes
const CONFIG = {
  TARGET_CONNECTIONS: 300,
  SELECTORS: {
    LOGIN: {
      username: '#username',
      password: '#password',
      submit: 'button[type="submit"]'
    },
    CONNECTION: {
      card: 'li.mn-connection-card',
      link: 'a.mn-connection-card__link'
    },
    PROFILE: {
      name: 'div.ph5.pb5 h1',
      jobTitle: 'div.text-body-medium.break-words',
      about: 'div[class*="display-flex.ph5.pv3"]',
      messageButton: '.pv-top-card-v2-ctas .artdeco-button--primary'
    },
    MESSAGE: {
      container: '.msg-form__contenteditable p',
      sendButton: '.msg-form__send-button:not(:disabled)'
    }
  },
  DELAYS: {
    typing: 50,
    betweenProfiles: 3000,
    scroll: 2000
  },
  TIMEOUTS: {
    navigation: 5000,
    elementWait: 3000
  },
  RETRIES: {
    navigation: 3
  }
};

// Função para navegação segura com retentativa
async function safeGoto(page, url, retries = CONFIG.RETRIES.navigation) {
  console.log(`Navegando para ${url}...`);
  for (let i = 0; i < retries; i++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: CONFIG.TIMEOUTS.navigation });
      console.log(`Navegação para ${url} bem-sucedida.`);
      return;
    } catch (error) {
      console.error(`Erro ao navegar para ${url} (Tentativa ${i + 1}): ${error.message}`);
      if (error.message.includes('socket hang up')) {
        console.error('Erro de socket detectado, tentando novamente...');
      }
      if (i === retries - 1) {
        throw error;
      }
      console.log('Esperando antes de tentar novamente...');
      await page.waitForTimeout(2000);
    }
  }
}

// Função para scroll e carregamento de conexões
async function scrollToLoadConnections(page) {
  console.log('Iniciando scroll para carregar conexões...');
  let previousHeight = 0, retries = 0;
  const maxRetries = 3;

  while (true) {
    const currentHeight = await page.evaluate('document.body.scrollHeight');
    if (currentHeight === previousHeight) {
      retries++;
      if (retries >= maxRetries) {
        console.log('Scroll concluído.');
        break;
      }
    } else {
      retries = 0;
    }
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await page.waitForTimeout(CONFIG.DELAYS.scroll);
    previousHeight = currentHeight;

    const connections = await page.$$(CONFIG.SELECTORS.CONNECTION.card);
    console.log(`Conexões carregadas: ${connections.length}`);
    if (connections.length >= CONFIG.TARGET_CONNECTIONS) {
      break;
    }
  }
}

// Função para extrair dados de perfil
async function extractProfileData(profilePage) {
  const profileInfo = { firstName: 'Profissional', jobTitle: 'Profissional', about: '' };

  try {
    await profilePage.waitForSelector(CONFIG.SELECTORS.PROFILE.name, { timeout: CONFIG.TIMEOUTS.elementWait });
    profileInfo.firstName = await profilePage.$eval(CONFIG.SELECTORS.PROFILE.name, el => el.textContent.trim().split(' ')[0]);
    console.log(`Nome encontrado: ${profileInfo.firstName}`);
  } catch {
    console.warn('Nome não encontrado.');
  }

  try {
    await profilePage.waitForSelector(CONFIG.SELECTORS.PROFILE.jobTitle, { timeout: CONFIG.TIMEOUTS.elementWait });
    profileInfo.jobTitle = await profilePage.$eval(CONFIG.SELECTORS.PROFILE.jobTitle, el => el.textContent.trim());
    console.log(`Cargo encontrado: ${profileInfo.jobTitle}`);
  } catch {
    console.warn('Cargo não encontrado.');
  }

  try {
    await profilePage.waitForSelector(CONFIG.SELECTORS.PROFILE.about, { timeout: CONFIG.TIMEOUTS.elementWait });
    profileInfo.about = await profilePage.$eval(CONFIG.SELECTORS.PROFILE.about, el => el.textContent.trim());
    console.log(`Bio encontrada: ${profileInfo.about}`);
  } catch {
    console.warn('Bio não encontrada.');
  }

  return profileInfo;
}

// Função para enviar mensagem
async function sendMessage(profilePage, message) {
  try {
    console.log('Verificando presença do botão de mensagem...');
    await profilePage.waitForSelector(CONFIG.SELECTORS.PROFILE.messageButton, { timeout: CONFIG.TIMEOUTS.elementWait });

    console.log('Clicando no botão de mensagem...');
    await profilePage.click(CONFIG.SELECTORS.PROFILE.messageButton);

    console.log('Esperando campo de mensagem...');
    await profilePage.waitForSelector(CONFIG.SELECTORS.MESSAGE.container, { timeout: CONFIG.TIMEOUTS.elementWait });

    console.log('Digitando mensagem...');
    await profilePage.type(CONFIG.SELECTORS.MESSAGE.container, message, { delay: CONFIG.DELAYS.typing });

    console.log('Clicando no botão de enviar...');
    await profilePage.waitForSelector(CONFIG.SELECTORS.MESSAGE.sendButton, { timeout: CONFIG.TIMEOUTS.elementWait });
    await profilePage.click(CONFIG.SELECTORS.MESSAGE.sendButton);

    console.log('Mensagem enviada com sucesso.');
  } catch (error) {
    console.error(`Erro ao enviar mensagem: ${error.message}`);
  }
}

// Função para processar um perfil
async function processProfile(browser, profileUrl, instructions) {
  const profilePage = await browser.newPage();
  try {
    await safeGoto(profilePage, profileUrl, CONFIG.RETRIES.navigation);

    const profileInfo = await extractProfileData(profilePage);
    const message = await generateMessage(profileInfo.firstName, profileInfo.jobTitle, profileInfo.about, instructions);

    console.log(`Mensagem gerada: ${message}`);
    await sendMessage(profilePage, message);
  } catch (error) {
    console.error('Erro ao processar perfil:', error.message);
  } finally {
    await profilePage.close();
  }
}

// Função principal para login e envio de mensagens
async function loginAndSendMessages(email, password, searchUrl, instructions) {
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'], defaultViewport: null });
  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36');

  try {
    console.log('Iniciando login...');
    await safeGoto(page, 'https://www.linkedin.com/login', CONFIG.RETRIES.navigation);
    await page.type(CONFIG.SELECTORS.LOGIN.username, email, { delay: CONFIG.DELAYS.typing });
    await page.type(CONFIG.SELECTORS.LOGIN.password, password, { delay: CONFIG.DELAYS.typing });
    await page.click(CONFIG.SELECTORS.LOGIN.submit);
    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: CONFIG.TIMEOUTS.navigation });

    console.log('Login realizado com sucesso.');

    console.log('Navegando para conexões...');
    await safeGoto(page, searchUrl, CONFIG.RETRIES.navigation);
    await scrollToLoadConnections(page);

    const connections = await page.$$(CONFIG.SELECTORS.CONNECTION.card);
    console.log(`Conexões carregadas: ${connections.length}`);

    for (let i = 0; i < Math.min(connections.length, CONFIG.TARGET_CONNECTIONS); i++) {
      const profileUrl = await connections[i].$eval(CONFIG.SELECTORS.CONNECTION.link, el => el.href);
      console.log(`Processando conexão ${i + 1}: ${profileUrl}`);
      await processProfile(browser, profileUrl, instructions);
      await page.waitForTimeout(CONFIG.DELAYS.betweenProfiles);
    }

  } catch (error) {
    console.error('Erro principal:', error.message);
  } finally {
    await browser.close();
    console.log('Processo finalizado.');
  }
}

export default loginAndSendMessages;
