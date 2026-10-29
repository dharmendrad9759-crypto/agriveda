import { generateBottle } from './packaging-generator-lib';

async function main() {
  await generateBottle({
    slug: 'chlorantraniliprole-lambda-zc',
    name1: 'CHLORANTRANILIPROLE +',
    name2: 'LAMBDA-CYHALOTHRIN 9.3% + 4.6% ZC',
    formulation: 'AMPLIGO GRADE ZC',
    category: 'insecticide',
    volume: '80 ml / 200 ml',
  });
  console.log('Generated chlorantraniliprole-lambda-zc.jpg');
}

main();
