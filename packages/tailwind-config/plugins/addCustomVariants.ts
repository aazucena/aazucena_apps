import plugin from 'tailwindcss/plugin';

const addCustomVariants = plugin(({ addVariant }) => {
  addVariant('intersect', '&:not([no-intersect])');
});

export default addCustomVariants;