  //Load more function
$('#load').click(function () {
    let currentHeight = parseInt($('#update').css('height'));
    let newHeight = currentHeight + 620; 
    $('#update').css('height', newHeight);
});

    var datas = [];

$(document).ready(function () {
    // Fetch the data from your server
    $.get("http://localhost:8000/all", function (data) {
        datas = data;
    }).fail(function () {
        console.error("Failed to fetch data from localhost:8000/all");
    });

    // Listen for input in the search box
    $("#search").on('input', function () {
        let query = $(this).val().toLowerCase();

        if (query.length > 0) {
            $('#update').hide();
            $('#load').hide();
            var find = datas.filter(cures => cures.activity.toLowerCase().includes(query));
            displayResults(find);
        } else {
            $('#update').show();
            $('#load').show();
            $('#result').empty();
        }
    });
});

// Function to display the filtered results
function displayResults(results) {
    $('#result').empty();  // Clear previous results

    if (results.length === 0) {
        $('#result').html('<p>No results found</p>');  // If no results, show a message
    } else {
        results.forEach(function(result) {
            $('#result').append('<div class="cure update"><h2 "margin-bottom: 20px;height: 50px;">' + result.activity + '</h2><div class="line" style="width:356px;margin-left:0px;position: relative;"></div><p> Participants: ' + result.participants + '</p><p>Category: '+result.type+'</p><p>Difficulty: '+result.difficulty+'</p><p>Duration: '+result.duration+'</p><form action="/update-cure" method="post"><input type="hidden" name="id" value="'+ result.key +'"><button class="edit">Update cure</button></form> </div>');
        });
    }
}

// Function to display popup
$(document).ready(function() {
    $('.upd').click(function () {
        $('#updateModal').fadeIn();
        $('#modalId').val( $(this).val());
    });

    $('#closeModal').click(function() {
        $('#updateModal').fadeOut();
        $('#modalId').val('');
    });
});

// Function to make the input field required
$(document).ready(function() {
$("#select").change(function () {
    const selectedValue = $(this).val(); 

    $(".modal-content label").hide();
    $('#select input').removeAttr('required');

    if(selectedValue){
        $("#modal"+selectedValue).fadeIn();
        $("#modal"+selectedValue+" input").attr('required',true);
    }
});
});

// Dark mode toggle
$("#Theme").click(function () {
        $("body").toggleClass("dark");
});

// Function to remember theme
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        $('body').addClass('dark');
    }else{
        $('body').removeClass('dark');
        $('body').addClass('light');
    }

    $('#Theme').on('click', function () {
        if (!$('body').hasClass('dark')) {
            savedTheme = localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    });


