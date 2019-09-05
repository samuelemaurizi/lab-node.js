const deleteProduct = btn => {
  const prodId = btn.parentNode.querySelector('[name=productId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
  const prodArticle = btn.closest('article');
  // console.log(prodId);
  fetch(`/admin/product/${prodId}`, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf
    }
  })
    .then(result => result.json())
    .then(data => {
      console.log(data);
      prodArticle.remove();
    })
    .catch(err => console.log(err));
};
