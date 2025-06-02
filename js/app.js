// js/app.js
document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/get_dados.php')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('lista-experiencias');
      if (data.experiencias.length === 0) {
        container.innerHTML = '<p>Nenhuma experiência cadastrada.</p>';
        return;
      }
      data.experiencias.forEach(exp => {
        const card = `
          <div class="card">
            <h3>${exp.cargo} - ${exp.empresa}</h3>
            <p>${exp.descricao}</p>
            <small>${exp.inicio} a ${exp.fim || 'Atual'}</small>
          </div>
        `;
        container.innerHTML += card;
      });
    });
});
