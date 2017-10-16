var modes = [  
    {  
        "name":"Anime",
        "regexp":"https:\/\/simkl.com\/anime\/\\d+\/([^\/]*)\/episode-(\\d+)",
        "sites":[  
            "AnimeFLV",
            "JKAnime"
        ]
    }
];

window.addEventListener("lprequestend", function(){addAlternativeLinks();});

/*Common*/

function addAlternativeLinks(){
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

function addLinkElement(site, episodeLink){
    let newLinkHtml = 
        "<tr><td height=\"46\">" +
        "<div class=\"SimklTVDetailEpisodeLinksItem Sub ajLinkInside SimklEnhancer\" id=\"emb0\">" +
            "<a target=\"_blank\" href=\"" + episodeLink + "\">"+
            "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">" +
                "<tbody><tr>"        +
                    "<td width=\"1\" class=\"SimklTVDetailEpisodeLinkNumber\">Sub<\/td>"+
                    "<td width=\"1\"><div class=\"SimklTVDetailEpisodeLink"+ site +"\">&nbsp;<\/div><\/td>"+
                    "<td class=\"SimklTVDetailEpisodeLinkDesc\">"+
                        "Free full episode available. Click here to watch now.<br>"+
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

/*Anime*/

function addAlternativeLinksAnime(info, mode){
    mode["sites"].forEach(function(site){
        const episodeLink = window["getLink"+site](info[1], info[2]);
        checkLink(
            episodeLink,
            function(){
                addLinkElement(site, episodeLink);
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