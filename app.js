#!/usr/bin/env node
'use strict'
const prog = require('caporal')
const { option, logger } = require('caporal')
const getIP = require('external-ip')()
const localIpV4Address = require('local-ipv4-address')
const path = require('path');
const convertCsvToXlsx = require('@aternus/csv-to-xlsx');
const axios = require('axios');
const cheerio = require('cheerio');

prog
    .version('1.0.0')
    .command('lowercase', 'Lowercase the text')    //1 String Transformation
    .argument('<lowercase>', 'lowercase to print')
    .action((args, option, logger) => {
        var text = args.lowercase
        logger.info(text.toLowerCase())
    })
    .command('uppercase', 'Uppercase the text')
    .argument('<uppercase>', 'lowercase to print')
    .action((args, option, logger) => {
        var text = args.uppercase
        logger.info(text.toUpperCase())
    })
    .command('capitalize', 'Capitalize the text')
    .argument('<capitalize>', 'capitalize to print')
    .action((args, option, logger) => {
        var text = args.capitalize
        var capitalize = text.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))

        logger.info(capitalize)
    })
    .command('add', 'inputtext')                //2 Arithmetic
    .argument('[env...]', 'Other environments')
    .action((args ,option, logger) => {
        var s = 0;
        for(var i=0; i<args.env.length; i++)
            s += parseInt(args.env[i]);
        logger.info(s)
    })
    .command('palindrome', 'Palindrome the text') //3 Palindrome
    .argument('<palindrome>', 'palindrome to print')
    .action((args, option, logger) => {
        var str = args.palindrome
        var re = /[^A-Za-z0-9]/g;
        str = str.toLowerCase().replace(re, '');
        var len = str.length;
        for (var i = 0; i < len/2; i++) {
            if (str[i] !== str[len - 1 - i]) {
                logger.info("No")
            }
        }
        logger.info("Yes")
    })
    .command('ip-external', 'Get external IP') //6 Get IP Address in private network
    .action((args, option, logger) => {
        getIP((err, ip) => {
            if (err) {
                // every service in the list has failed
                throw err;
            }
            logger.info(ip)
        });
    })
    .command('ip', 'Get IP')              //7 Get External IP Address
    .action((args, option, logger) => {
        localIpV4Address().then(function(ipAddress){
            logger.info(ipAddress)
        });
    })
    .command('random', 'Random')              //5 Random String
    .option('--length <length>', 'Length', prog.INT)
    .option('--letters <letters>', 'Length', prog.BOOL)
    .option('--uppercase <uppercase>', 'Length', prog.STRING)
    .action((args, option, logger) => {
        let r = Math.random().toString(length).substring(length);
    })
    .command('convert', 'Convert file') //9 Import/Export CSV/XLS/XLSX file.
    .argument('<source>', 'palindrome to print')
    .argument('<destination>', 'palindrome to print')
    .action((args, option, logger) => {
        var source =    path.join(__dirname, args.source);
        var destination = path.join(__dirname, args.destination);
        
        try {
            convertCsvToXlsx(source, destination);
          } catch (e) {
            console.error(e.toString());
          }
    })
    .command('headlines', 'Geadlines') //8 Get headlines from https://www.kompas.com/
    .action((args, option, logger) => {
    axios.get('https://indeks.kompas.com/headline')
    .then(function (response) {
        let getData = html => {
        data = []
        const $ = cheerio.load(html)
                $('table.itemlist tr td:nth-child(3)').each((i, elem) => {
                    data.push({
                    title : $(elem).text(),
                    link : $(elem).find('a.article__link').attr('href')
                    })
                })
                console.log(data)
                }
                getData(response.data)

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
        })




prog.parse(process.argv);