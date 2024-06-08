document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form[method="POST"]');
    forms.forEach(form => {
        const methodInput = form.querySelector('input[name="_method"]');
        if (methodInput) {
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                const formData = new FormData(form);
                const method = formData.get('_method').toUpperCase();

                if (method === 'DELETE') {
                    fetch(form.action, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(Object.fromEntries(formData.entries()))
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            alert(data.error);
                        } else {
                            window.location.href = data.redirect || '/';
                        }
                    })
                    .catch(error => console.error('Error:', error));
                } else {
                    form.submit();
                }
            });
        }
    });
});
