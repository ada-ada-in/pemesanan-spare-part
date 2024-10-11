$(document).ready(function () {
  $("#chatForm").on("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = {
      name: $("#name").val(),
      coupleName: $("#coupleName").val(),
      attedance: $("#attedance").val(),
      chat: $("#chat").val(),
    };

    $.ajax({
      type: "POST",
      url: "/chat",
      data: formData,
      success: function (response) {
        // Append the new message to the chat list
        $("#chatList").append(
          "<li>" + formData.chat + " - " + formData.name + "</li>"
        );
        // Clear the form fields
        $("#chatForm")[0].reset();
      },
      error: function (err) {
        console.error("Error: ", err);
      },
    });
  });
});
