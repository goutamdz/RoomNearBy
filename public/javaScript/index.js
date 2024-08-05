document.getElementById('delete-button').addEventListener('click', function(event) {
    if (confirm('Are you sure you want to delete this item?')) {
        document.getElementById('delete-form').submit();
    }
});

document.getElementById('deletebutton').addEventListener('click', function(event) {
    // Show the confirmation dialog
    if (confirm('Are you sure you want to delete this item?')) {
        // Find the form and submit it
        let x = document.getElementById('deleteform');
        x.submit();
    }
});

