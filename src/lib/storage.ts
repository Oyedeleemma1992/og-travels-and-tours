export const getStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch(e) {
    return [];
  }
};

export const setStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const generateId = () => Math.random().toString(36).substr(2, 9);
