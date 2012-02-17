////////////////////////////////////////////////////////////////////////////////
// Using this javascript the functionality of this firefox extention has been 
// implemented, i.e. opening window, connection to the different web server etc.  
////////////////////////////////////////////////////////////////////////////////

//this are the global variables
var count=0;
var pastHistory1=0;
var URL = "";

//This array stores search history
var  historyc= new Array();

///Initially history is null
for(var i=0; i<10; i++)
{
historyc[i]='';
}



////////////////////////////////////////////////////////////////////////////////
// The Winfo_Search() function will perform a Web search for us. The two
// parameters that get passed in are the event that triggered this function
// call, and the type of search to perform.
////////////////////////////////////////////////////////////////////////////////
function Winfo_Search(event, type)
{
    // This variable will hold the URL we will browse to
    URL = "";

    // This variable will tell us whether our search box is empty or not
    var isEmpty = false;

    // Get a handle to our search terms box (the <menulist> element)
    var searchTermsBox = document.getElementById("Winfo-SearchTerms");
    //alert (searchTermsBox);
    // Get the value in the search terms box, trimming whitespace as necessary
    // The Winfo_TrimString() function deletes multiple leading and tralling 
    // white space.
    var searchTerms = Winfo_TrimString(searchTermsBox.value);    var h1=searchTerms;
    if(searchTerms.length == 0) // Is the search terms box empty?
        isEmpty = true;         // If so, set the isEmpty flag to true
    else                        // If not, convert the terms to a URL-safe string
        searchTerms = Winfo_ConvertTermsToURI(searchTerms);

    // Now switch on whatever the incoming type value is
    // If the search box is empty, we simply redirect the user to the appropriate
    // dictionary server. Otherwise, we connect to the server with appropiate key word.

    switch(type)
     {
     // Build up the URL to get the bengali meaning
      case "bengali":
        if(isEmpty) { URL = "http://www.bengalinux.org"; }
        else        { URL = "http://www.bengalinux.org/cgi-bin/abhidhan/index.pl?en_word=" + searchTerms + "&lookupbtn=Look+it+up" ; }
        break;


     // Build up the URL to get the hindi meaning
     case "hindi":
     default:
        if(isEmpty) { URL = "http://www.shabdkosh.com/"; }
        else        { URL = "http://www.shabdkosh.com/en2hi/search.php?e=" + searchTerms +"&f=0"; }
        break;
    }
    
    //Get the string which has been selected by mouse, in the current winow
    var focusedWindow = document.commandDispatcher.focusedWindow;
    var selection = focusedWindow.getSelection();

   
     //We will load the url here only when window is not focused and
     //the data in the searchTermsBox is not null
     if(selection=='' && !isEmpty)
	{
		// Load the URL in the browser window using the Winfo_LoadURL function
		    Winfo_LoadURL(URL);

		//Here we are storing the search history
		if(historyc[0]!=searchTerms)
		{			
    			for(var i=9; i>0; i--)
				{
   	    				historyc[i]=historyc[i-1];
				}
    	   			historyc[0]=h1;
	 	}	
	}
     else //other wise we will use the selected text as the key word
	{
		switch(type)
    		{
    			// Build up the URL to get the bengali meaning
    			case "bengali":
          		{ URL = "http://www.bengalinux.org/cgi-bin/abhidhan/index.pl?en_word=" + selection + "&lookupbtn=Look+it+up" ; 
			}
        		break;


    			// Build up the URL to get the hindi meaning
    			case "hindi":
    			default: //deafult case is hindi
        	       { URL = "http://www.shabdkosh.com/en2hi/search.php?e=" + selection +"&f=0";
			}
        		break;
    		}
		Winfo_LoadURL(URL);

		//Here we are storing the search history
		
	}
}

////////////////////////////////////////////////////////////////////////////////
// The Winfo_TrimString() function will trim all leading and trailing whitespace
// from the incoming string, and convert all runs of more than one whitespace
// character into a single space. The altered string gets returned.
////////////////////////////////////////////////////////////////////////////////
function Winfo_TrimString(string)
{
    // If the incoming string is invalid, or nothing was passed in, return empty
    if (!string)
        return "";

    string = string.replace(/^\s+/, ''); // Remove leading whitespace
    string = string.replace(/\s+$/, ''); // Remove trailing whitespace

    // Replace all whitespace runs with a single space
    string = string.replace(/\s+/g, ' ');

    return string; // Return the altered value
}

////////////////////////////////////////////////////////////////////////////////
// The Winfo_ConvertTermsToURI() function converts an incoming string of search
// terms to a safe value for passing into a URL.
////////////////////////////////////////////////////////////////////////////////
function Winfo_ConvertTermsToURI(terms)
{
    // Create an array to hold each search term
    var termArray = new Array();

    // Split up the search term string based on the space character
    termArray = terms.split(" ");

    // Create a variable to hold our resulting URI-safe value
    var result = "";

    // Loop through the search terms
    for(var i=0; i<termArray.length; i++)
    {
        // All search terms (after the first one) are to be separated with a '+'
        if(i > 0)
            result += "+";

        // Encode each search term, using the built-in Firefox function
        // encodeURIComponent().
        result += encodeURIComponent(termArray[i]);
    }

    return result; // Return the result
}

////////////////////////////////////////////////////////////////////////////////
// The Winfo_LoadURL() function loads the specified URL in the browser.
////////////////////////////////////////////////////////////////////////////////
function Winfo_LoadURL(url)
{
   // Open a new browser window  locating to the incoming URL
   // Height and width are fixed.
    window.open(url, "info", "chrome,width=600,height=450");
}



////////////////////////////////////////////////////////////////////////////////
// The Winfo_KeyHandler() function checks to see if the key that was pressed
// is the [Enter] key. If it is, a web search is performed.
////////////////////////////////////////////////////////////////////////////////
function Winfo_KeyHandler(event)
{
    // Was the key that was pressed [ENTER]? If so, perform a web search.
    if(event.keyCode == event.DOM_VK_RETURN)
	{
           Winfo_Search(event, 'hindi');
	}
}



////////////////////////////////////////////////////////////////////////////////
// The Winfo_Populate() function places dynamically generated menu items inside
// our toolbar's search box drop-down menu. Here it is generating the search
// history.
////////////////////////////////////////////////////////////////////////////////
function Winfo_Populate()
{
    // Get the menupopup element that we will be working with
    var menu = document.getElementById("Winfo-SearchTermsMenu");

    // Remove all of the items currently in the popup menu
    for(var i=menu.childNodes.length - 1; i >= 0; i--)
    {
        menu.removeChild(menu.childNodes.item(i));
    }


    // Specify how many items we should add to the menu
    var numItemsToAdd = 10;
//
for(var i=0; i<numItemsToAdd; i++)
    {
    
        var tempItem = document.createElement("menuitem");

        // Set the new menu item's label
        tempItem.setAttribute("label", historyc[i]);
	//
        // Add the item to our menu
        menu.appendChild(tempItem);
     
    }
}

