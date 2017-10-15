window.addEventListener("lprequestend", function(){addAlternativeLinks();});

function addAlternativeLinks(){
    const episodeRegexp = /https:\/\/simkl.com\/anime\/\d+\/([^\/]*)\/episode-(\d+)/g;

    let info = episodeRegexp.exec(window.location.href);
    if(info !== null){
        const episodeLink = "https://animeflv.net/ver/1/" + info[1] + "-" + info[2];

        let newLinkHtml = 
        "<div class=\"SimklTVDetailEpisodeLinksItem Sub ajLinkInside SimklTVDetailEpisodeLinksItemAnimeFLV\" id=\"emb0\">" +
            "<a target=\"_blank\" href=\"" + episodeLink + "\">"+
            "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">" +
                "<tbody><tr>"        +
                    "<td width=\"1\" class=\"SimklTVDetailEpisodeLinkNumber\">Sub<\/td>"+
                    "<td width=\"1\"><div class=\"SimklTVDetailEpisodeLinkAnimeFLV\">&nbsp;<\/div><\/td>"+
                    "<td class=\"SimklTVDetailEpisodeLinkDesc\">"+
                        "Free full episode available. Click here to watch now.<br>"+
                    "<\/td>"+
                    "<td width=\"1\" class=\"SimklTVDetailEpisodeLinkGo\">\u00BB<\/td>"+
                "<\/tr><\/tbody>" +
            "<\/table>"+
             "<\/a>"+
        "<\/div>";

        var episodeLinkElements = document.getElementsByClassName("SimklTVDetailEpisodeLinksItem");
        episodeLinkElements[episodeLinkElements.length-1].insertAdjacentHTML("afterend", newLinkHtml);
    }
    
}
