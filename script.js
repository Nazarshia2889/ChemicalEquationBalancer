var btn = document.getElementById("btn");
var elements = [];
var reactantsIndices = {};
var productsIndices = {};
var coefficients = document.getElementsByName("coefficient");

getFraction = (decimal) => {
  for(var denominator = 1; (decimal * denominator) % 1 !== 0; denominator++);
  return {numerator: decimal * denominator, denominator: denominator};
}

btn.addEventListener("click", function() {
  var arr1 = document.getElementsByName("reactant");
  var arr2 = document.getElementsByName("product");
  arr1 = filter(arr1);
  arr2 = filter(arr2);
  reactantsIndices = {};
  productsIndices = {};
  elements = [];
  var dict1 = turnIntoDictionary1(arr1);
  var dict2 = turnIntoDictionary2(arr2);
  var uniqueElements = elements.filter((v, i, a) => a.indexOf(v) === i);
  var coeffs = getCoeffs(dict1, dict2, uniqueElements);
  var solutions = getDenArr(rref(coeffs));
  for(var i = 0; i < coefficients.length; i++) {
    coefficients[i].value = solutions[i];
  }
});

function getCoeffs(dict1, dict2, uniqueElements) {
  var arr = [];
  for(var i = 0; i < uniqueElements.length; i++) {
    arr.push([0, 0, 0, 0]);
  }
  indexI = 0;
  for(var i = 0; i < uniqueElements.length; i++) {
    var curr = uniqueElements[i];
    arr[indexI][reactantsIndices[curr]] = dict1[curr];
    if ((curr + "1") in dict1) {
      arr[indexI][reactantsIndices[curr+"1"]] = dict1[curr+"1"];
    }
    arr[indexI][productsIndices[curr]] = -1  * dict2[curr];
    if ((curr + "1") in dict2) {
      arr[indexI][productsIndices[curr+"1"]] = -1 * dict2[curr+"1"];
    }
    indexI++;
  }
  return arr;
}

function turnIntoDictionary1(arr1) {
  var dict1 = {};
  for(var i = 0; i < arr1.length; i++) {
    var part = compoundSplit(arr1[i].value);
    var compound = "";
    for(var j = 0; j < part.length; j++){
      if(!isNaN(part[j])) {
        if(i == 0) {
          if(compound in dict1) {
            dict1[compound] += Number(part[j]);
          }
          else {
            dict1[compound] = Number(part[j]);
            reactantsIndices[compound] = i;
          }
        }
        else {
          if(compound in dict1) {
            if((compound+"1") in dict1) {
              dict1[compound+"1"] += Number(part[j]);
            }
            else {
              dict1[compound+"1"] = Number(part[j]);
              reactantsIndices[compound + "1"] = i;
            }
          }
          else {
            if(compound in dict1 && reactantsIndices[compound] == 3) {
              dict1[compound] += Number(part[j]);
            }
            else {
              dict1[compound] = Number(part[j]);
              reactantsIndices[compound] = i;
            }
          }
        }
        elements.push(compound);
        compound = "";
      }
      else {
        compound += part[j];
      }
    }
  }
  return dict1;
}

function turnIntoDictionary2(arr2) {
  var dict2 = {};
  for(var i = 0; i < arr2.length; i++) {
    var part = compoundSplit(arr2[i].value);
    var compound = "";
    for(var j = 0; j < part.length; j++){
      if(!isNaN(part[j])) {
        if(i == 0) {
          if(compound in dict2) {
            dict2[compound] += Number(part[j]);
          }
          else {
            dict2[compound] = Number(part[j]);
            productsIndices[compound] = i + 2;
          }
        }
        else {
          if(compound in dict2) {
            if((compound+"1") in dict2) {
              dict2[compound+"1"] += Number(part[j]);
            }
            else {
              dict2[compound+"1"] = Number(part[j]);
              productsIndices[compound + "1"] = i + 2;
            }
          }
          else {
            if(compound in dict2 && productsIndices[compound] == 3) {
              dict2[compound] += Number(part[j]);
            }
            else {
              dict2[compound] = Number(part[j]);
              productsIndices[compound] = i + 2;
            }
          }
        }
        elements.push(compound);
        compound = "";
      }
      else {
        compound += part[j];
      }
    }
  }
  return dict2;
}

function rref(A) {
  var rows = A.length;
  var columns = A[0].length;
  
  var lead = 0;
  for (var k = 0; k < rows; k++) {
    if (columns <= lead) return;
    
    var i = k;
    while (A[i][lead] === 0) {
        i++;
        if (rows === i) {
            i = k;
            lead++;
            if (columns === lead) return;
        }
    }
    var irow = A[i], krow = A[k];
    A[i] = krow, A[k] = irow;
     
    var val = A[k][lead];
    for (var j = 0; j < columns; j++) {
        A[k][j] /= val;
    }
     
    for (var i = 0; i < rows; i++) {
        if (i === k) continue;
        val = A[i][lead];
        for (var j = 0; j < columns; j++) {
            A[i][j] -= val * A[k][j];
        }
    }
    if(k == 2){
      return A;
    }
  }
  return A;
};

function gcd(a, b)
{
    if (b == 0)
        return a;
    return gcd(b, a % b);
}

function lcm(arr, n)
{
    let ans = arr[0];
    for (let i = 1; i < n; i++)
        ans = (((arr[i] * ans)) /
                (gcd(arr[i], ans)));
    return ans;
}

function lcd(denArr)
{
    var lcd = lcm(denArr, denArr.length);
    return lcd;
}

function getDenArr(A) {
  var denArr = [];
  var solutions = [];
  for(var i = 0; i < 3; i++) {
    denArr.push(getFraction(Math.abs(A[i][3]))['denominator']);
    solutions.push(Math.abs(A[i][3]));
  }
  
  var lcdVal = lcd(denArr);
  solutions.push(1);
  for(var i = 0; i < solutions.length; i++) {
    solutions[i] = solutions[i] * lcdVal;
  }
  return solutions;
}

function compoundSplit(compound) {
  var split = [];
  for(var i = 0; i < compound.length-1; i++) {
    if(compound[i] == "(") {
      i++;
      var temp = [];
      var index = i;
      while(compound[index] != ")") {
        if(!isNaN(compound[index])) {
          if(!isNaN(compound[index+1])) {
            temp.push(compound[index] + compound[index+1]);
            index++;
          }
          else {
            temp.push(compound[index]);
          }
        }
        else if(compound[index] == compound[index].toUpperCase() && compound[index+1] == compound[index+1].toLowerCase() && isNaN(compound[index+1]) && compound[index+1] != ")") {
          temp.push(compound[index] + compound[index+1]);
          index++;
        }
        else {
          temp.push(compound[index]);
        }
        if(isNaN(compound[index]) && isNaN(compound[index+1])) {
          temp.push(1);
        }
        index++;
      }
      index++;
      var num = compound[index];
      for(var j = 0; j < temp.length; j++) {
        if(!isNaN(temp[j])) {
          split.push(temp[j] * num);
        }
        else {
          split.push(temp[j]);
        }
      }
      i = index;
      if(i == compound.length-1) {
        return split;
      }
    }
    else if(!isNaN(compound[i])) {
      if(!isNaN(compound[i+1])) {
        split.push(compound[i] + compound[i+1]);
        i++;
      }
      else {
        split.push(compound[i]);
      }
    }
    else if(compound[i] == compound[i].toUpperCase() && compound[i+1] == compound[i+1].toLowerCase() && isNaN(compound[i+1])) {
      split.push(compound[i] + compound[i+1]);
      i++;
    }
    else {
      split.push(compound[i]);
    }
    if(isNaN(compound[i]) && isNaN(compound[i+1])) {
      split.push(1);
    }
    if(i == compound.length-2) {
      if(isNaN(compound[compound.length-1])) {
        split.push(compound[compound.length-1]);
        split.push(1);
      }
      else {
        split.push(compound[compound.length-1]);
      }
    }
  }
  return split;
}

function filter(li) {
  var result = [];
  for(var i = 0; i < li.length; i++) {
    if(li[i].value != "") {
      result.push(li[i]);
    }
  }
  return result;
}