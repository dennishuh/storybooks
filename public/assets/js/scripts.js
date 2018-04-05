$(document).ready(() => {
  $(".sidenav").sidenav();
  $("select").formSelect();

  $('#delete-form').on('submit', function(e) {
    e.preventDefault();
    if (confirm('Do you want to delete this story?')) {
      this.submit();
    }
  })
});

CKEDITOR.replace("body", {
  plugins: "wysiwygarea,toolbar,basicstyles,link"
});
