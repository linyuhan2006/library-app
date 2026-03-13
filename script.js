// 初始化数据
const initBooks = [
    { id: 1, title: 'JavaScript高级程序设计', author: 'Nicholas C. Zakas', isbn: '9787115275790', available: true, category: '计算机', cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=JavaScript%20book%20cover&image_size=square' },
    { id: 2, title: '深入理解计算机系统', author: 'Randal E. Bryant', isbn: '9787111407010', available: true, category: '计算机', cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=computer%20system%20book%20cover&image_size=square' },
    { id: 3, title: '算法导论', author: 'Thomas H. Cormen', isbn: '9787302330646', available: true, category: '计算机', cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=algorithm%20book%20cover&image_size=square' },
    { id: 4, title: 'Python编程：从入门到实践', author: 'Eric Matthes', isbn: '9787115428028', available: true, category: '计算机', cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20programming%20book%20cover&image_size=square' },
    { id: 5, title: '数据结构与算法分析', author: 'Mark Allen Weiss', isbn: '9787302437337', available: true, category: '计算机', cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20structure%20book%20cover&image_size=square' }
];

// 检查localStorage中是否已有数据，如果没有则初始化
if (!localStorage.getItem('books')) {
    localStorage.setItem('books', JSON.stringify(initBooks));
}

if (!localStorage.getItem('borrowedBooks')) {
    localStorage.setItem('borrowedBooks', JSON.stringify([]));
}

if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}

if (!localStorage.getItem('currentUser')) {
    localStorage.setItem('currentUser', JSON.stringify(null));
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 标签页切换功能
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // 移除所有标签页的active类
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.style.display = 'none');
            
            // 激活当前标签页
            this.classList.add('active');
            document.getElementById(tabId).style.display = 'block';
            
            // 如果切换到借阅记录标签，更新借阅记录
            if (tabId === 'borrowed') {
                updateBorrowedList();
            }
        });
    });
    
    // 搜索功能
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    
    searchBtn.addEventListener('click', function() {
        searchBooks();
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBooks();
        }
    });
    
    // 添加图书功能
    const addBookForm = document.getElementById('add-book-form');
    addBookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addBook();
    });
    
    // 初始加载图书列表
    searchBooks();
    
    // 返回按钮事件
    document.getElementById('back-btn').addEventListener('click', function() {
        // 切换回搜索标签
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.style.display = 'none');
        
        document.querySelector('[data-tab="search"]').classList.add('active');
        document.getElementById('search').style.display = 'block';
    });
    
    // 检查用户登录状态
    checkLoginStatus();
    
    // 登录按钮事件
    document.getElementById('login-btn').addEventListener('click', function() {
        document.getElementById('login-modal').style.display = 'block';
    });
    
    // 注册按钮事件
    document.getElementById('register-btn').addEventListener('click', function() {
        document.getElementById('register-modal').style.display = 'block';
    });
    
    // 退出按钮事件
    document.getElementById('logout-btn').addEventListener('click', function() {
        logout();
    });
    
    // 关闭模态框
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            document.getElementById('login-modal').style.display = 'none';
            document.getElementById('register-modal').style.display = 'none';
        });
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // 登录表单提交
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        login();
    });
    
    // 注册表单提交
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        register();
    });
});

// 检查用户登录状态
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('welcome-message').textContent = `欢迎, ${currentUser.username}`;
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('register-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'inline-block';
    } else {
        document.getElementById('welcome-message').textContent = '欢迎';
        document.getElementById('login-btn').style.display = 'inline-block';
        document.getElementById('register-btn').style.display = 'inline-block';
        document.getElementById('logout-btn').style.display = 'none';
    }
}

// 用户登录
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(user => user.username === username && user.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        checkLoginStatus();
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('login-form').reset();
        alert('登录成功！');
    } else {
        alert('用户名或密码错误！');
    }
}

// 用户注册
function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password !== confirmPassword) {
        alert('两次输入的密码不一致！');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users'));
    if (users.find(user => user.username === username)) {
        alert('用户名已存在！');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        username: username,
        password: password
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    document.getElementById('register-modal').style.display = 'none';
    document.getElementById('register-form').reset();
    alert('注册成功！请登录');
}

// 用户退出
function logout() {
    localStorage.setItem('currentUser', JSON.stringify(null));
    checkLoginStatus();
    alert('退出成功！');
}

// 显示图书详情
function showBookDetail(bookId) {
    const books = JSON.parse(localStorage.getItem('books'));
    const book = books.find(book => book.id === bookId);
    
    if (!book) {
        alert('未找到图书信息');
        return;
    }
    
    // 切换到详情标签
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.style.display = 'none');
    
    document.getElementById('detail').style.display = 'block';
    
    // 渲染图书详情
    const detailContent = document.getElementById('detail-content');
    detailContent.innerHTML = `
        <div class="detail-cover" style="text-align: center; margin-bottom: 20px;">
            <img src="${book.cover || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20book%20cover&image_size=square'}" alt="${book.title}" style="width: 200px; height: 280px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);">
        </div>
        <h3>${book.title}</h3>
        <p><strong>作者:</strong> ${book.author}</p>
        <p><strong>分类:</strong> ${book.category}</p>
        <p><strong>ISBN:</strong> ${book.isbn}</p>
        <p><strong>状态:</strong> <span class="book-status ${book.available ? 'status-available' : 'status-borrowed'}">${book.available ? '可借阅' : '已借出'}</span></p>
        <div class="detail-actions">
            <button class="borrow-btn" ${!book.available ? 'disabled' : ''} onclick="borrowBook(${book.id});">
                ${book.available ? '借阅' : '已借出'}
            </button>
            <button class="back-btn" onclick="goBack();">返回列表</button>
        </div>
    `;
}

// 返回列表
function goBack() {
    // 切换回搜索标签
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.style.display = 'none');
    
    document.querySelector('[data-tab="search"]').classList.add('active');
    document.getElementById('search').style.display = 'block';
}

// 搜索图书
function searchBooks() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    const books = JSON.parse(localStorage.getItem('books'));
    const searchResults = document.getElementById('search-results');
    
    let filteredBooks = books;
    
    // 应用搜索过滤
    if (searchTerm) {
        filteredBooks = filteredBooks.filter(book => 
            book.title.toLowerCase().includes(searchTerm) || 
            book.author.toLowerCase().includes(searchTerm)
        );
    }
    
    // 应用分类过滤
    if (categoryFilter !== 'all') {
        filteredBooks = filteredBooks.filter(book => book.category === categoryFilter);
    }
    
    // 渲染搜索结果
    searchResults.innerHTML = '';
    if (filteredBooks.length === 0) {
        searchResults.innerHTML = '<p>没有找到匹配的图书</p>';
        return;
    }
    
    filteredBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.style.cursor = 'pointer';
        bookCard.innerHTML = `
            <div class="book-cover">
                <img src="${book.cover || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20book%20cover&image_size=square'}" alt="${book.title}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 10px;">
            </div>
            <h3>${book.title}</h3>
            <p>作者: ${book.author}</p>
            <p>分类: ${book.category}</p>
            <p>ISBN: ${book.isbn}</p>
            <button class="borrow-btn" ${!book.available ? 'disabled' : ''} onclick="borrowBook(${book.id}); event.stopPropagation();">
                ${book.available ? '借阅' : '已借出'}
            </button>
        `;
        bookCard.addEventListener('click', () => showBookDetail(book.id));
        searchResults.appendChild(bookCard);
    });
}

// 借阅图书
function borrowBook(bookId) {
    const books = JSON.parse(localStorage.getItem('books'));
    const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks'));
    
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex !== -1 && books[bookIndex].available) {
        // 更新图书状态
        books[bookIndex].available = false;
        
        // 添加到借阅记录
        const borrowedBook = {
            ...books[bookIndex],
            borrowDate: new Date().toISOString()
        };
        borrowedBooks.push(borrowedBook);
        
        // 保存到localStorage
        localStorage.setItem('books', JSON.stringify(books));
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
        
        // 重新搜索以更新界面
        searchBooks();
        
        // 如果当前在详情页面，更新详情
        if (document.getElementById('detail').style.display === 'block') {
            showBookDetail(bookId);
        }
        
        // 显示成功消息
        alert('图书借阅成功！');
    }
}

// 归还图书
function returnBook(bookId) {
    const books = JSON.parse(localStorage.getItem('books'));
    const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks'));
    
    // 更新图书状态
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex !== -1) {
        books[bookIndex].available = true;
    }
    
    // 从借阅记录中移除
    const borrowedIndex = borrowedBooks.findIndex(book => book.id === bookId);
    if (borrowedIndex !== -1) {
        borrowedBooks.splice(borrowedIndex, 1);
    }
    
    // 保存到localStorage
    localStorage.setItem('books', JSON.stringify(books));
    localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
    
    // 更新借阅记录列表
    updateBorrowedList();
    
    // 重新搜索以更新界面
    searchBooks();
    
    // 显示成功消息
    alert('图书归还成功！');
}

// 更新借阅记录列表
function updateBorrowedList() {
    const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks'));
    const borrowedList = document.getElementById('borrowed-list');
    
    borrowedList.innerHTML = '';
    if (borrowedBooks.length === 0) {
        borrowedList.innerHTML = '<p>暂无借阅记录</p>';
        return;
    }
    
    borrowedBooks.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        
        // 格式化借阅日期
        const borrowDate = new Date(book.borrowDate);
        const formattedDate = borrowDate.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        
        bookCard.innerHTML = `
            <h3>${book.title}</h3>
            <p>作者: ${book.author}</p>
            <p>分类: ${book.category}</p>
            <p>ISBN: ${book.isbn}</p>
            <p>借阅日期: ${formattedDate}</p>
            <button class="return-btn" onclick="returnBook(${book.id})">归还</button>
        `;
        borrowedList.appendChild(bookCard);
    });
}

// 添加图书
function addBook() {
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    const isbn = document.getElementById('book-isbn').value;
    const category = document.getElementById('book-category').value;
    const coverFile = document.getElementById('book-cover').files[0];
    
    if (!title || !author || !isbn || !category) {
        alert('请填写完整的图书信息');
        return;
    }
    
    const books = JSON.parse(localStorage.getItem('books'));
    
    // 生成新的图书ID
    const newId = Math.max(...books.map(book => book.id), 0) + 1;
    
    // 创建新图书
    const newBook = {
        id: newId,
        title: title,
        author: author,
        isbn: isbn,
        category: category,
        available: true,
        cover: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(title)}%20book%20cover&image_size=square`
    };
    
    // 添加到图书列表
    books.push(newBook);
    
    // 保存到localStorage
    localStorage.setItem('books', JSON.stringify(books));
    
    // 清空表单
    document.getElementById('add-book-form').reset();
    
    // 显示成功消息
    alert('图书添加成功！');
}