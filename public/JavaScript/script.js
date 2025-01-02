  //Load more function
$('#load').click(function () {
    let currentHeight = parseInt($('#update').css('height'));
    let newHeight = currentHeight + 620; 
    $('#update').css('height', newHeight);
});

    var datas = [];

// Fetch the data
$.get("https://bored-api-lz1n.vercel.app/all", function (data) {
    datas = data;
}).fail(function () {
    console.error("Failed to fetch data from the API.");
});

// Listen for input in the search box
$("#search").on('input', function () {
    let query = $(this).val().toLowerCase();

    if (query.length > 0) {
        $('#update').hide();
        $('#load').hide();
        var find = datas.filter(cures => {
            // Check if 'activity' exists and is a string
            if (cures.activity && typeof cures.activity === 'string') {
                return cures.activity.toLowerCase().includes(query);
            }
            return false; // If 'activity' is undefined or not a string, return false
        });
        displayResults(find);
    } else {
        $('#update').show();
        $('#load').show();
        $('#result').empty();
    }
});

// Function to display the filtered results
function displayResults(results) {
    $('#result').empty();  // Clear previous results

    if (results.length === 0) {
        $('#result').html('<p>No results found</p>');  // If no results, show a message
    } else {
        results.forEach(function(result) {
            $('#result').append(`
                <div class="cure update">
                    <h2 style="margin-bottom: 20px;height: 50px;">${result.activity}</h2>
                    <div class="line" style="width:356px;margin-left:0px;position: relative;"></div>
                    <p>Participants: ${result.participants}</p>
                    <p>Category: ${result.type}</p>
                    <p>Difficulty: ${result.difficulty}</p>
                    <p>Duration: ${result.duration}</p>
                    <button class="edit upd" value="${result.key}" id="edit">Update cure</button>
                    <form action="/delete" method="post">
                        <button class="edit delete" value="${result.key}" name="delete">Delete cure</button>
                    </form>
                </div>
            `);
        });
    }
}


// Function to display popup
// Function to display popup
$(document).ready(function() {
    // Use event delegation for dynamically added elements
    $(document).on('click', '.upd', function() {
        $('#updateModal').fadeIn();
        $('#modalId').val($(this).val());
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


