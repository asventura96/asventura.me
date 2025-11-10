/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESSA LINHA É FUNDAMENTAL PARA O DEPLOY NA HOSTINGER
  // output: 'export',
  
  // Opcional: Se você estiver usando o componente <Image /> do Next
  // e não quiser usar um serviço de otimização de imagem
  // (que não funcionará em hospedagem estática):
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;