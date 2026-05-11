/**
 * Ground Objects Data Generation
 * Generates data for houses, trees, bushes, rocks, and flowers
 */

import type { HouseData, TreeData, BushData, RockData, FlowerData } from '@aazucena/types';

const HOUSE_COLORS = ['#D4AF37', '#CD853F', '#DEB887', '#F4A460', '#E6BE8A'];
const BUSH_COLORS = ['#228B22', '#2E8B57', '#3CB371', '#90EE90'];
const FLOWER_COLORS = ['#FF69B4', '#FFD700', '#FF6347', '#FF4500', '#FFA500', '#FFFF00'];

/**
 * Generate house data for ground phase
 */
export function generateHouseData(count: number): HouseData[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const radius = 6 + Math.random() * 2;

    return {
      position: [Math.cos(angle) * radius, -0.5, Math.sin(angle) * radius] as [
        number,
        number,
        number,
      ],
      rotation: Math.random() * Math.PI * 2,
      scale: 0.7 + Math.random() * 0.3,
      color: HOUSE_COLORS[Math.floor(Math.random() * HOUSE_COLORS.length)] || '#D4AF37',
    };
  });
}

/**
 * Generate tree data for ground phase
 */
export function generateTreeData(count: number): TreeData[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const radius = 4.5 + Math.random() * 2.5;

    return {
      position: [Math.cos(angle) * radius, -0.5, Math.sin(angle) * radius] as [
        number,
        number,
        number,
      ],
      scale: 0.6 + Math.random() * 0.3,
    };
  });
}

/**
 * Generate bush data for ground phase
 */
export function generateBushData(count: number): BushData[] {
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const radius = 2.5 + Math.random() * 4;

    return {
      position: [Math.cos(angle) * radius, -0.5, Math.sin(angle) * radius] as [
        number,
        number,
        number,
      ],
      scale: 0.25 + Math.random() * 0.2,
      color: BUSH_COLORS[Math.floor(Math.random() * BUSH_COLORS.length)] || '#228B22',
    };
  });
}

/**
 * Generate rock data for ground phase
 */
export function generateRockData(count: number): RockData[] {
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 4.5;

    return {
      position: [Math.cos(angle) * radius, -0.5, Math.sin(angle) * radius] as [
        number,
        number,
        number,
      ],
      scale: 0.2 + Math.random() * 0.2,
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [
        number,
        number,
        number,
      ],
    };
  });
}

/**
 * Generate flower data for ground phase
 */
export function generateFlowerData(count: number): FlowerData[] {
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const radius = 2 + Math.random() * 5;

    return {
      position: [Math.cos(angle) * radius, -0.48, Math.sin(angle) * radius] as [
        number,
        number,
        number,
      ],
      scale: 0.1 + Math.random() * 0.1,
      color: FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)] || '#FF69B4',
    };
  });
}
