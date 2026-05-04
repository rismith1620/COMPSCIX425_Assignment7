let pageSize = 10;
let query = 'the lord of the rings';
let books = [];
let page = 0;
let totalPages = 0;

let isLoading = false;

function onSearch() {
    const input = document.querySelector('#search_input');
    query = input.value.trim();
    console.log(query)
    page = 0; // reset pagination on new search
    doFetch();
}

function render() {
    let bookDiv = document.querySelector('#books_div');
    let pagesSpan = document.querySelector('#pages_span');
    

    pagesSpan.textContent = `${page + 1} / ${totalPages || 1}`;

    if (isLoading) {
        bookDiv.innerHTML = '<div class="loader">Loading...</div>';
        return;
    }

    if (!books || books.length === 0) {
        bookDiv.innerHTML = '<p>No results found.</p>';
        return;
    }

    // Build HTML for each book
    bookDiv.innerHTML = books.map(book => {
        const coverUrl = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : 'https://via.placeholder.com/128x193?text=No+Cover';
        
        return `
            <div class="book">
                <img src="${coverUrl}" alt="Book Cover">
                <h3>${book.title || 'No title'}</h3>
                <p>Author: ${(book.author_name ? book.author_name.join(', ') : 'Unknown author')}</p>
                <p>Language: ${(book.language ? book.language.join(', ') : 'Unknown language')}</p>
                <p>First published: ${book.first_publish_year || 'N/A'}</p>
                <p>Publisher(s): ${(book.publisher || []).join(',')}</p>

                

            </div>
        `;
    }).join('');
}

function incrementPage() {
    if (page >= totalPages - 1) return;
    page++;
    doFetch();
}

function decrementPage() {
    if (page <= 0) return;
    page--;
    doFetch();
}


async function doFetch() {
    const offset = page * pageSize;
    const url = 'https://openlibrary.org/search.json?q=' + encodeURIComponent(query) +
        '&limit=' + pageSize + '&offset=' + offset;

    console.log('making query to ', url);

    isLoading = true;
    render();

    try {
        const response = await fetch(url);
        const data = await response.json();

        books = data.docs || [];

        totalPages = Math.ceil((data.numFound || 0) / pageSize);

    } catch (error) {
        console.error('Fetch error:', error);
        books = [];
        totalPages = 0;
    }

    isLoading = false;
    render();
}