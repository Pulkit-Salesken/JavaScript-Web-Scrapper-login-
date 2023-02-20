const pup = require("puppeteer");
const cheerio = require("cheerio");
const json2csv = require("json2csv").Parser;
const fs = require("fs");
const movies = [
    "https://salesken.atlassian.net/wiki/spaces/SALV2/pages/2161836040/Intelligence+page+-+Agent"
    // "https://www.imdb.com/title/tt7888964/?ref_=hm_tpks_tt_i_1_pd_tp1_cp",
    // "https://www.imdb.com/title/tt8368512/?ref_=tt_sims_tt",
    // "https://www.imdb.com/title/tt9203694/?ref_=tt_sims_tt",
    // "https://www.imdb.com/title/tt0293429/?ref_=tt_sims_tt",
    // "https://www.imdb.com/title/tt9208876/?ref_=tt_sims_tt",
    // "https://www.imdb.com/title/tt9140554/?ref_=tt_sims_tt",
    // "https://www.imdb.com/title/tt3480822/?ref_=tt_sims_tt",
    // "https://www.imdb.com/title/tt13623126/?ref_=tt_sims_tt",
];

(async () => {
    const browser = await pup.launch({
        headless: false,
        headers: {
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en,q=0.9",
            "content-type": "application/json",
            "cookie": "atl.xsrf.token=750f19916944030afc43e204ab2b5b068582aa40; JSESSIONID=BF4B18C9BAAC0D7D21D0E8EAEFD86BAD; ajs_anonymous_id=%22fee0c117-909b-4bc9-9fee-f924afd9f647%22; atlassian.xsrf.token=32ec1b22-d6dd-4873-835b-a13c58e6c485_3bd08e064223115335d150dcdeeb24ba2124390f_lin; cloud.session.token=eyJraWQiOiJzZXNzaW9uLXNlcnZpY2VcL3Byb2QtMTU5Mjg1ODM5NCIsImFsZyI6IlJTMjU2In0.eyJhc3NvY2lhdGlvbnMiOltdLCJzdWIiOiI2M2JlNTk5MzcxMzM0OWJlYTE4NzQxN2YiLCJlbWFpbERvbWFpbiI6InNhbGVza2VuLmFpIiwiaW1wZXJzb25hdGlvbiI6W10sImNyZWF0ZWQiOjE2NzM0Mzk0MDQsInJlZnJlc2hUaW1lb3V0IjoxNjc2NDYzMzc0LCJ2ZXJpZmllZCI6dHJ1ZSwiaXNzIjoic2Vzc2lvbi1zZXJ2aWNlIiwic2Vzc2lvbklkIjoiMzkzZWM3MzctZjcwNS00MWY5LWE2NzMtY2U1YWE1NTBiZDQ5Iiwic3RlcFVwcyI6W10sImF1ZCI6ImF0bGFzc2lhbiIsIm5iZiI6MTY3NjQ2Mjc3NCwiZXhwIjoxNjc5MDU0Nzc0LCJpYXQiOjE2NzY0NjI3NzQsImVtYWlsIjoicHVsa2l0QHNhbGVza2VuLmFpIiwianRpIjoiMzkzZWM3MzctZjcwNS00MWY5LWE2NzMtY2U1YWE1NTBiZDQ5In0.yG84AbJ6neVffiZlN6iViZlnV7VIiWPg4OrXcpc02BCSJzkITJMSD9hhE9SSlTG6dgkAco88o_KSNCX0aOogb6zN64UXj0GPhm13cznRpPeR4hWw5GFbXUntiKyBEg5LGk_ybV2Ssa4arD2D0ERaApM6vnlSOr-JcMWOYYX03pRgQP-6Dqghe9QLB-XVFs6xSepgpo5oz3mwycsSz6UV6Jef_8D4dPfEGnWfY-_LpkoNROUM5zCLSXrpZA7XG9creSUjdUkgFP_uKUXpPn8XU0xljCgZFWb_bVbAL9DrxrHMECLndT4753nNc8SxBOf9iwqH2x6tIyxhfqjnAae-nw; JSESSIONID=56A46FC597CCA152FD2C80CD1F723A2C; tenant.session.token=eyJraWQiOiJzZXNzaW9uLXNlcnZpY2VcL3Byb2QtMTU5Mjg1ODM5NCIsImFsZyI6IlJTMjU2In0.eyJhc3NvY2lhdGlvbnMiOltdLCJzdWIiOiI2M2JlNTk5MzcxMzM0OWJlYTE4NzQxN2YiLCJlbWFpbERvbWFpbiI6InNhbGVza2VuLmFpIiwiaW1wZXJzb25hdGlvbiI6W10sImNyZWF0ZWQiOjE2NzM0Mzk0MDQsInJlZnJlc2hUaW1lb3V0IjoxNjc2NDYzNTk5LCJ2ZXJpZmllZCI6dHJ1ZSwiaXNzIjoic2Vzc2lvbi1zZXJ2aWNlIiwic2Vzc2lvbklkIjoiMzkzZWM3MzctZjcwNS00MWY5LWE2NzMtY2U1YWE1NTBiZDQ5Iiwic3RlcFVwcyI6W10sImF1ZCI6ImF0bGFzc2lhbiIsIm5iZiI6MTY3NjQ2Mjk5OSwiZXhwIjoxNjc5MDU0OTk5LCJpYXQiOjE2NzY0NjI5OTksImVtYWlsIjoicHVsa2l0QHNhbGVza2VuLmFpIiwianRpIjoiMzkzZWM3MzctZjcwNS00MWY5LWE2NzMtY2U1YWE1NTBiZDQ5In0.UWUzDSWmLQ1-_hyLqVkqDCcTAHvCSLm0G2xK2RQjos1hal3w06RF9g2_41gFHntHfe2L3O9Ayd6P6nFLIiYVJOK6nCLi8Hbdodg3GEwkAx6aw3LeR64e5jbg_PK9P2Kg21qV69MSst0bmN44f2dy5hK7yHnBOOoXy4L9mEjZCYFhM-FJN9BUHEsEVYOiI_bA8DYye1nLewH2zTciaUuS_fX0zZZTYo7mO-iSV08IKalvvnszClFcR3gc5NhAf04yHeAG3CaqSPpigyd2LPze99p_SlhAhIIaeoTBLQb5IuF7WP1rMxlhuMmQQKOjyzaJOyRJAkYtONDfTJSTN_KRKQ",
            "executablePath": 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            "userDataDir": 'C:\Users\Salesken\AppData\Local\Google\Chrome\User'

            // "accept": "*/*",
            // "accept-encoding": "gzip, deflate, br",
            // "accept-language": "en-US,en;q=0.9,la;q=0.8",
        },
        gzip: true,
    });
    const $ = cheerio.load(browser);
    const page = await browser();
    let movieData = [];
    for (let movie of movies) {
        await page.goto(movie).then(function () {
            return page.content();
        })
            .then(function (html) {

                // let movieName = $("div[class=title_wrapper] > h1 ", html).text().trim();
                // let rating = $("div[class=ratingValue] > strong > span[itemprop=ratingValue]", html).text().trim();
                // let genres = $("a[href*='/search/title?genres']", html).text();
                // let releaseDate = $("a[href*='releaseinfo']", html).text();

                let data = $("div", html).text().trim();


                // let checkString = "";

                // (categoriesModification = () => {
                //     releaseDate = releaseDate.split("\n")[0].replace("Release Dates", "");
                //     for (let i = 0; i < genres.length; i++) {
                //         if (genres.charAt(i) == " ") {
                //             genres = genres.slice(i).trim();
                //             break;
                //         }
                //     }
                //     if (!rating) {
                //         rating = "Not Released!"
                //     }
                //     else {
                //         rating = rating + "/10";
                //     }
                // })();
                // movieData.push({
                //     movieName,
                //     rating,
                //     releaseDate,
                //     genres

                // });

                movieData.push({
                    data
                })


            })
    }

    const j2c = new json2csv();
    const csv = j2c.parse(movieData)
    fs.writeFileSync("./imdbMovieData.csv", csv, "utf-8");
    // await browser.close();

})();