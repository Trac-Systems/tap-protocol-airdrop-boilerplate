import { Address } from '@cmdcode/tapscript';
import util from "util";
import fs from 'graceful-fs';

const readFile = util.promisify(fs.readFile);

let template = {
    "p" : "tap",
    "op" : "token-send",
    "items" : []
};

let tpls = [];
let tpl_idx = -1;
let addresses = await readFile('./drop.csv');
addresses = addresses.toString().trim().replaceAll("\r","");
let splitted = addresses.split("\n");

for(let i = 0; i < splitted.length; i++)
{
    let ticker = splitted[i].split(',')[0].trim();
    let address = splitted[i].split(',')[1].trim();
    let amount = splitted[i].split(',')[2].trim();

    if(i % 3000 === 0)
    {
        tpl_idx += 1;
        tpls.push(JSON.parse(JSON.stringify(template)));
    }

    if(isValidBitcoinAddress(address))
    {
        tpls[tpl_idx].items.push({
            "tick": ticker,
            "amt": amount,
            "address" : address
        });
    }
}

for(let i = 0; i < tpls.length; i++)
{
    if(await exists('./drop/' + i + '.txt'))
    {
        await fs.promises.unlink('./drop/' + i + '.txt');
    }

    await fs.promises.writeFile('./drop/' + i + '.txt', JSON.stringify(tpls[i]));
}

function isValidNumber(strNum)
{
    let validNumber = new RegExp(/^\d*\.?\d*$/);
    return validNumber.test(''+strNum);
}

function resolveNumberString(number, decimals){

    if(!isValidNumber(number))
    {
        console.log('Invalid number', number);
        throw new Error('Invalid op number');
    }

    let splitted = number.split(".");
    if(splitted.length == 1 && decimals > 0){
        splitted[1] = '';
    }
    if(splitted.length > 1) {
        let size = decimals - splitted[1].length;
        for (let i = 0; i < size; i++) {
            splitted[1] += "0";
        }
        let new_splitted = '';
        for(let i = 0; i < splitted[1].length; i++)
        {
            if(i >= decimals)
            {
                break;
            }
            new_splitted += splitted[1][i];
        }
        number = "" + (splitted[0] == '0' ? '' : splitted[0]) + new_splitted;
        if(BigInt(number) == 0n || number === ''){
            number = "0";
        }
    }

    try {

        while (number.charAt(0) === '0') {
            number = number.substring(1);
        }

    }catch(e){

        number = '0';
    }

    return number === '' ? '0' : number;
}

function isValidBitcoinAddress(toAddress) {

    if(toAddress.startsWith('bc1q'))
    {
        try {
            Address.p2wpkh.decode(toAddress, 'main').hex;
            return true;
        } catch (e) {
            console.log('invalid address, skipped:', toAddress);
        }

    }
    else if(toAddress.startsWith('1') || toAddress.startsWith('m') || toAddress.startsWith('n'))
    {
        try {
            Address.p2pkh.decode(toAddress, 'main').hex;
            return true;
        } catch (e) {
            console.log('invalid address, skipped:', toAddress);
        }
    }
    else if(toAddress.startsWith('3') || toAddress.startsWith('2'))
    {
        try {
            Address.p2sh.decode(toAddress, 'main').hex;
            return true;
        } catch (e) {
            console.log('invalid address, skipped:', toAddress);
        }
    }
    else
    {
        try {
            Address.p2tr.decode(toAddress).hex;
            return true;
        } catch (e) {
            console.log('invalid address, skipped:', toAddress);
        }
    }

    return false;
}

function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));
}

async function exists(filename){

    return !!(await fs.promises.stat(filename).catch(() => null));
}