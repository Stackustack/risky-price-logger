const followProductButton = jQuery('#followProductButton');
const followProductInput = jQuery('#followProductInput');

followProductButton.on('click', () => {
  const url = followProductInput.val();

  followProductButton.html(
    `<span
        class="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
      ></span> &nbsp;&nbsp; Following...`,
  );

  axios
    .post('/products', { url })
    .then((res) => {
      if (res.status == 201) {
      } else {
        console.log(
          `Something went wrong when adding new product for url: ${url}`,
        );
      }
    })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      location.reload();
    });
});
