export default {
  async beforeCreate(event: any) {
    const { data } = event.params;
    validatePreloaderData(data);
  },

  async beforeUpdate(event: any) {
    const { data } = event.params;
    validatePreloaderData(data);
  },
};

function validatePreloaderData(data: any) {
  // Validate minDisplayTime < maxDisplayTime
  if (data.minDisplayTime && data.maxDisplayTime) {
    if (data.minDisplayTime >= data.maxDisplayTime) {
      throw new Error(
        `minDisplayTime (${data.minDisplayTime}ms) must be less than maxDisplayTime (${data.maxDisplayTime}ms)`
      );
    }
  }

  // Validate loading steps don't have duplicate IDs
  if (data.loadingSteps && Array.isArray(data.loadingSteps)) {
    const stepIds = data.loadingSteps.map((step: any) => step.id);
    const uniqueIds = new Set(stepIds);

    if (stepIds.length !== uniqueIds.size) {
      const duplicates = stepIds.filter((id: number, index: number) => stepIds.indexOf(id) !== index);
      throw new Error(
        `Duplicate loading step IDs found: ${duplicates.join(', ')}. Each step must have a unique ID.`
      );
    }
  }

  // Validate theme overrides JSON if provided
  if (data.themeOverrides && typeof data.themeOverrides === 'string') {
    try {
      JSON.parse(data.themeOverrides);
    } catch (error) {
      throw new Error(
        `Invalid JSON in themeOverrides field. Please check your syntax.`
      );
    }
  }
}