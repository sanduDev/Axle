import { browserHistory } from 'react-router';
import { HTTP } from './Http.service';

export async function setStorage(key, data) {
  const value = await localStorage.setItem(key, data);
  return value;
}

export function getStorage(key) {
  const value = localStorage.getItem(key);
  return value;
}

export async function removeItem(key) {
  return await localStorage.removeItem(key);
}

export function redirection() {
  browserHistory.push('/');
  return;
}
export function clearSession() {
  localStorage.clear();
  return;
}
export async function defaultAccount(token) {

  const response = HTTP('get', 'getDefaultAccount', null, { 'Authorization': token });
  return response;
}
