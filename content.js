var modes = [  
    {  
        "name":"Anime",
        "regexp":"https:\/\/simkl.com\/anime\/\\d+\/([^\/]*)\/episode-(\\d+)",
        "showText": "episode",
        "sites":[  
            "AnimeFLV",
            "JKAnime"
        ]
    },
    {  
        "name":"Serie",
        "regexp":"https:\/\/simkl.com\/tv\/\\d+\/([^\/]*)\/season-(\\d+)\/episode-(\\d+)",
        "showText": "episode",
        "sites":[  
            "PopCornTime"
        ]
    },
    {  
        "name":"Movie",
        "regexp":"https:\/\/simkl.com\/movies\/\\d+\/([^\/]*)",
        "showText": "movie",
        "sites":[  
            "Rainierland",
            "SubsMovies"
        ]
    },

];

window.addEventListener("lprequestend", function(){addAlternativeLinks();});

/*Common*/

function addAlternativeLinks(){

    if((info = /https:\/\/simkl.com\/[^\/]*\/\d+\/([^\/]*)/g.exec(window.location.href))){
        saveIMDbID(info[1]);
    }

    modes.forEach(function(mode){
        const episodeRegexp = new RegExp(mode["regexp"], 'g');

        let info = episodeRegexp.exec(window.location.href);

        if(info !== null){
            window["addAlternativeLinks"+mode["name"]](info, mode);
        }

    });
        
}

function checkLink(link, callback){
    var http = new XMLHttpRequest();
    http.open('HEAD', link);
    http.onreadystatechange = function() {
        if (this.readyState == this.DONE && ![400, 404, 500, 503].includes(this.status) ) {
            callback();
        }
    };
    http.send();
}

function addLinkChapterElement(mode, site, episodeLink){
    let newLinkHtml = 
        "<tr><td height=\"46\">" +
        "<div class=\"SimklTVDetailEpisodeLinksItem Sub ajLinkInside SimklEnhancer\" id=\"emb0\">" +
            "<a target=\"_blank\" href=\"" + episodeLink + "\">"+
            "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">" +
                "<tbody><tr>"        +
                    "<td width=\"1\" class=\"SimklTVDetailEpisodeLinkNumber\">Sub<\/td>"+
                    "<td width=\"1\"><div class=\"SimklTVDetailEpisodeLink"+ site +"\">&nbsp;<\/div><\/td>"+
                    "<td class=\"SimklTVDetailEpisodeLinkDesc\">"+
                        "Free full pirate "+mode["showText"]+" available. Click here to watch now.<br>"+
                    "<\/td>"+
                    "<td width=\"1\" class=\"SimklTVDetailEpisodeLinkGo\">\u00BB<\/td>"+
                "<\/tr><\/tbody>" +
            "<\/table>"+
             "<\/a>"+
        "<\/div>" +
        "</td></tr>";

    var episodeLinkElements = document.getElementsByClassName("SimklTVDetailEpisodeLinksItem");

    if(episodeLinkElements[0] != null){
        episodeLinkElements[episodeLinkElements.length-1].insertAdjacentHTML("afterend", newLinkHtml);
    }else{
        var moreLinksElement = document.getElementsByClassName("SimklTVDetailEpisodeLinksMore")[0];
        var elementWherePlaceTheLink = moreLinksElement.parentElement.parentElement;
        elementWherePlaceTheLink.insertAdjacentHTML("beforebegin", newLinkHtml)
        elementWherePlaceTheLink.insertAdjacentHTML("beforebegin", "<tr><td height=\"28\"> </td></tr>");
    }
}

function saveIMDbID(name){
    var imdbElement = document.querySelectorAll('[src="//eu.simkl.in/img_tv/ico-rating_imdb.png"]')[0];
    if((imdbElement) != null){
        const id = imdbElement.parentElement
            .getAttribute("href")
            .replace(/http:\/\/www\.imdb\.com\/title\/tt|\/$/g, "");
        chrome.storage.sync.set({[name]:id});
    }

}

function getIMDbID(name, callback){
    chrome.storage.sync.get(
        name,
        function(result){
            callback(result[name]);
        }
    );
    
}

/*Anime*/

function addAlternativeLinksAnime(info, mode){
    mode["sites"].forEach(function(site){
        const episodeLink = window["getLink"+site](info[1], info[2]);
        checkLink(
            episodeLink,
            function(){
                addLinkChapterElement(mode, site, episodeLink);
            }
        );
    });
    
}


function getLinkAnimeFLV(serie, episode){
    return "https://animeflv.net/ver/1/" + serie + "-" + episode;
}

function getLinkJKAnime(serie, episode){
    return "https://jkanime.net/"+serie+"/"+episode+"/";
}

/*Movie*/

function addAlternativeLinksMovie(info, mode){
    mode["sites"].forEach(function(site){
        const movieLink = window["getLink"+mode["name"]+site](info[1]);
        checkLink(
            movieLink,
            function(){
                addLinkChapterElement(mode, site, movieLink);
            }
        );    
    });
    
}

function getLinkMovieRainierland(movie){
    const normalizeLink = movie.replace(/the-?|you-?|me-?/g, "");
    return "https://www.rainierland.one/movie/" + normalizeLink;
}

function getLinkMovieSubsMovies(movie){
    return "http://subsmovies.tv/watch?movie=" + getIMDbID(movie);
}

/*Series*/

function addAlternativeLinksSerie(info, mode){
    mode["sites"].forEach(function(site){
        getIMDbID(
            info[1],
            function(imdbId){
                checkLink(
                    movieLink = getLinkSeriePopCornTime(info[1], info[2], info[3], imdbId),
                    function(){
                        addLinkChapterElement(mode, site, movieLink);
                    }
                );  
            }
        ); 
    });
    
}


function getLinkSeriePopCornTime(serie, season, episode, imdbId){
    return "https://watch.popcorntime-online.tv/"+serie+".html?imdb=" + imdbId + "-" + season + "-" + episode;
}