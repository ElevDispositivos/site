document.addEventListener('DOMContentLoaded', async function() {
    // Inicialização do Supabase
    const supabaseUrl = 'https://pvlobuvyblzcielydbum.supabase.co'; // Mantenha seu URL do Supabase
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2bG9idXZ5Ymx6Y2llbHlkYnVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NTExMjcsImV4cCI6MjA2MTUyNzEyN30.o4VBtpt5wHLj7j-RpcHGYgh6eogCpMnp9jDJM4yecMw'; // Mantenha sua chave do Supabase
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    // Função para buscar posts
    async function fetchPosts() {
        const { data, error } = await supabase
            .from('view_posts_blog')
            .select('*');

        if (error) {
            console.error('Erro ao buscar posts:', error);
            return [];
        }
        return data;
    }

    // Função para buscar o último post da categoria "featured-post"
    async function fetchFeaturedPost() {
        const { data, error } = await supabase
            .from('view_posts_blog')
            .select('*')
            .eq('categoria', 'featured-post')
            .order('publicado_em', { ascending: false })
            .limit(1)
            .single(); // Pega apenas um post

        if (error) {
            console.error('Erro ao buscar post em destaque:', error);
            return null;
        }
        return data;
    }

    // Função para remover acentuação e converter para minúsculas
    function normalizeString(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    // Função para renderizar posts
    function renderPosts(posts) {
        const postGrid = document.querySelector('.post-grid');
        postGrid.innerHTML = '';
        posts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.className = 'post-card';
            postCard.setAttribute('data-category', normalizeString(post.categoria)); // Normaliza a categoria
            const imgUrl = post.url_img || '/midias/elev-fallback-blog.png';
            postCard.innerHTML = `
                <div class="post-image">
                    <img src="${imgUrl}" alt="${post.titulo}" style="width:100%; height:180px; object-fit:cover;">
                </div>
                <div class="post-content">
                    <span class="post-category">${post.categoria}</span>
                    <h3>${post.titulo}</h3>
                    <p class="post-excerpt">${post.conteudo.substring(0, 100)}...</p>
                    <a href="blog-post/?slug=${post.slug}" class="read-more">Ler mais</a>
                </div>
            `;
            postGrid.appendChild(postCard);
        });
    }

    // Função para renderizar o post em destaque
    function renderFeaturedPost(post) {
        const featuredPostWrapper = document.querySelector('.featured-post-wrapper');
        if (!post) {
            console.log('Nenhum post em destaque encontrado.');
            return;
        }

        const imgUrl = post.url_img || '/midias/elev-fallback-blog.png'; // Imagem de fallback
        featuredPostWrapper.innerHTML = `
            <div class="featured-post-image">
                <img src="${imgUrl}" alt="${post.titulo}" style="width:100%; height:300px; object-fit:cover;">
            </div>
            <div class="featured-post-content">
                <span class="post-category">${post.categoria}</span>
                <h2>${post.titulo}</h2>
                <p class="post-meta">
                    <span class="post-date">${new Date(post.publicado_em).toLocaleDateString()}</span> | 
                    <span class="post-author">Por ${post.autor}</span>
                </p>
                <p class="post-excerpt">${post.conteudo.substring(0, 100)}...</p>
                <a href="/blog-tecnico/blog-post/?slug=${post.slug}" class="btn btn-primary">Ler artigo completo</a>
            </div>
        `;
    }

    // Função para filtrar posts
    function filterPosts(category) {
        const postCards = document.querySelectorAll('.post-card');
        postCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (category === 'todos' || cardCategory === category) {
                card.style.display = 'flex'; // Exibe o cartão
            } else {
                card.style.display = 'none'; // Oculta o cartão
            }
        });
        console.log(`Filtrando por categoria: ${category}`);
    }

    // Adicionando evento de clique para os botões de categoria
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = normalizeString(this.dataset.category); // Normaliza a categoria do botão
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterPosts(category);
        });
    });

    // Inicialização
    async function init() {
        const posts = await fetchPosts();
        renderPosts(posts);

        const featuredPost = await fetchFeaturedPost();
        console.log('Post em destaque:', featuredPost); // Log para verificar os dados
        renderFeaturedPost(featuredPost);
    }

    init();

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    // Função para buscar posts
    function searchPosts(query) {
        console.log('Buscando por:', query);
        query = query.toLowerCase().trim();
        
        if (!query) {
            // Se a consulta estiver vazia, mostra todos os posts
            const postCards = document.querySelectorAll('.post-card');
            postCards.forEach(card => card.style.display = 'flex');
            return;
        }
        
        const postCards = document.querySelectorAll('.post-card');
        postCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const excerpt = card.querySelector('.post-excerpt').textContent.toLowerCase();
            const category = card.querySelector('.post-category').textContent.toLowerCase();
            
            console.log('Título:', title, ' | Excerpt:', excerpt, ' | Categoria:', category); // Log dos dados do cartão
            
            if (title.includes(query) || excerpt.includes(query) || category.includes(query)) {
                card.style.display = 'flex';
                console.log('Exibindo cartão:', card); // Log do cartão exibido
            } else {
                card.style.display = 'none';
                console.log('Ocultando cartão:', card); // Log do cartão ocultado
            }
        });
    }
    
    // Adicionando evento de clique para o botão de busca
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            searchPosts(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchPosts(searchInput.value);
                e.preventDefault();
            }
        });
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            if (!emailInput.value.trim()) return;
            
            // In a real implementation, you would submit the form data to a server
            
            // Show success message
            const formElement = this;
            const successMessage = document.createElement('div');
            successMessage.className = 'newsletter-success';
            successMessage.innerHTML = `
                <svg width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="18" fill="none" stroke="#FFFFFF" stroke-width="2" />
                    <path d="M12,20 L18,26 L28,16" fill="none" stroke="#FFFFFF" stroke-width="2" />
                </svg>
                <p>Obrigado por se inscrever! Em breve você receberá nossas atualizações.</p>
            `;
            
            // Replace form with success message
            formElement.innerHTML = '';
            formElement.appendChild(successMessage);
            
            // Reset form after 3 seconds (for demonstration purposes)
            setTimeout(function() {
                formElement.innerHTML = `
                    <div class="form-group">
                        <input type="email" placeholder="Seu melhor e-mail" required>
                        <button type="submit" class="btn btn-secondary">Inscrever-se</button>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" id="privacy" required>
                        <label for="privacy">Concordo em receber e-mails da ELEV Dispositivos</label>
                    </div>
                `;
            }, 3000);
        });
    }
    
    // Comment form
    const commentForm = document.querySelector('.comment-form form');
    
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real implementation, you would submit the form data to a server
            
            // Show success message
            alert('Seu comentário foi enviado com sucesso e será publicado após moderação.');
            
            // Clear form
            this.reset();
        });
    }
    
    // Smooth scrolling for TOC links
    const tocLinks = document.querySelectorAll('.post-toc a');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
});
