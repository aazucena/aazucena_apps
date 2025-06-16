import type { EditConfig, SaveConfig } from "../types";
export const setAttr = async(config: EditConfig) => {
  try {
    const pkg = await import('@directus/visual-editing');
    if (pkg && pkg?.setAttr && config) {
      const res = pkg.setAttr(config);
      return res;
    } else if (!config) {
      throw new Error('Missing config for setAttr');
    } else {
      throw new Error('Package @directus/visual-editing not found');
    }
  } catch (e) {
    console.error(e);
  }
}

export const disable = async() => {
  try {
    const pkg = await import('@directus/visual-editing');
    if (pkg && pkg?.disable) {
      const res = pkg.disable();
      return res;
    } else {
      throw new Error('Package @directus/visual-editing not found');
    }
  } catch (e) {
    console.error(e);
  }
}

export const remove = async() => {
  try {
    const pkg = await import('@directus/visual-editing');
    if (pkg && pkg?.remove) {
      const res = pkg.remove();
      return res;
    } else {
      throw new Error('Package @directus/visual-editing not found');
    }
  } catch (e) {
    console.error(e);
  }
}

export const apply = async(config: SaveConfig) => {
  try {
    const pkg = await import('@directus/visual-editing');
    if (pkg && pkg?.apply && config) {
      const res = pkg.apply(config);
      return res;
    } else if (!config) {
      throw new Error('Missing config for aplply');
    } else {
      throw new Error('Package @directus/visual-editing not found');
    }
  } catch (e) {
    console.error(e);
  }
}