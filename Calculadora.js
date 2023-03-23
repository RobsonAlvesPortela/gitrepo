class Calculadora {

    #screen;
    #openparenhteses
   
    

    constructor() {
        this.#screen = undefined;
        this.#openparenhteses = undefined;
    }

   set OpenParentheses(_openParentheses)
   {
        this.#openparenhteses = _openParentheses;
   }

   get OpenParentheses()
   {
        return this.#openparenhteses;
   }

    set Screen(_screen) {
        this.#screen = _screen;
    }

    get Screen() {
        return this.#screen;
    }

    ligar() {
        document.addEventListener('DOMContentLoaded', () => {


            let botoes = document.querySelectorAll('input');

            this.#screen = document.getElementById('tela');

            this.#openparenhteses = document.getElementById('parentheses_open');


            botoes.forEach((botao) => {
                
                if (botao.className === 'decimal') {
                    botao.addEventListener('click', (event) => {
                        this.inputDecimal(event.target.value);
                    });
                }

                if (botao.className === 'numero') {
                    botao.addEventListener('click', (event) => {
                        this.inputNumber(event.target.value);
                    });
                }

                if (botao.className === 'operador' && botao.value !== ' = '&& botao.value !== ' - ') {
                    botao.addEventListener('click', (event) => {
                        this.inputOp(event.target.value);
                    });
                };

                if (botao.value === ' - ') {
                    botao.addEventListener('click', (event) => {
                        this.inputNegativeNumberOrOperator();
                    });
                }

                if (botao.value === '(') {
                    botao.addEventListener('click', (event) => {
                        this.inputParentheses();
                    });
                };


                if (botao.value === ')') {
                    botao.addEventListener('click', (event) => {
                        this.closeParenteses();
                    });
                };

                if (botao.value.includes('CE')) {
                    botao.addEventListener('click', (event) => {
                        this.deleteType();
                    });
                };

                if (botao.value.includes('=')) {
                    botao.addEventListener('click', (event) => {
                        this.calculateExpression();
                    });
                };

            });



        });
    }

    screenText()
    {
       
        return this.Screen.textContent;
        
    }

    screenTextSplit()
    {
        return this.Screen.textContent.split('');
    }

    inputOnScreen(type) {


        this.Screen.textContent += type;

        
    }

    inputNumber(number) {

        let screenText = this.screenText();
        let lastTypeIsACloseParentheses = this.checkLastTypeIsACloseParentheses();

        if(screenText === '')
        {
            this.inputOnScreen(number)
        }
        else
        {
            if(lastTypeIsACloseParentheses)
            {
                this.inputOp(' * ');
                this.inputOnScreen(number);
            }
            else
            {
                this.inputOnScreen(number);
            }
        }
  
        this.splitScreenByParentheses();
    }

    splitTextScreenBySpace()
    {

        return [...this.screenText().split(' ')];

    }

    inputOp(op)
    {

        let lastTypeIsAOperator = this.checkLastTypeIsAOperator();
        let lastTypeIsANegativeSignal = this.checkLastTypeIsANegativeSignal();
        let lastTypeIsACloseParentheses = this.checkLastTypeIsACloseParentheses();
        let lastTypeIsAOppeningParentheses = this.checkLastTypeIsAOppeningParentheses();
        if((!lastTypeIsAOperator && !lastTypeIsANegativeSignal  && !lastTypeIsAOppeningParentheses)|| lastTypeIsACloseParentheses)
        {
            this.inputOnScreen(op)
        }
        else
        {
            if(!lastTypeIsANegativeSignal && !lastTypeIsAOppeningParentheses)
            {
                this.changeOp(op);
            }
            
        }
            
        
        this.splitScreenByParentheses();
    }

    changeOp(op) {
       
        let splitedTextScreen = [...this.screenTextSplit()];
        console.log(splitedTextScreen)

        splitedTextScreen.pop();
        splitedTextScreen.pop();
        splitedTextScreen.pop();

        this.Screen.textContent = splitedTextScreen.join('');

        this.inputOp(op);


    }

    checkCharacterIsAOperator(character)
    {
        let isAOperator = false
        if(character === '^' || character === '*' || character === '+'|| character ==='/')
        {
            isAOperator = true;
        }
        else
        {
            isAOperator = false;
        }

        return isAOperator;
    }

    checkCharacterIsAOpeningParentheses(character)
    {
        let isAOppeningOfParentheses = false
        if(character === '(')
        {
            isAOppeningOfParentheses = true;
        }
        else
        {
            isAOppeningOfParentheses = false;

        }

        return isAOppeningOfParentheses;
    }

    splitTextScreenByGroupOfNumbers()
    {
        let textScreenSplitted = [...this.splitTextScreenBySpace()];

        let textSplittedByGroupOfNumbers = [...this.splitTextScreenBySpace()];

        for(let i = 0; i < textScreenSplitted.length; i++)
        {

           

            switch(textSplittedByGroupOfNumbers[i])
            {
                case '':
                case ' ':
                case '*':
                case '^':
                case '/':
                case '+':
                    
                
                    textSplittedByGroupOfNumbers.splice(i, 1);

                    i = 0;

                    break;
              
                case '-':
                    
                    if(!this.checkCaracterIsAOperator(textSplittedByGroupOfNumbers[i-1]))
                    {
                        textSplittedByGroupOfNumbers.splice(i, 1);
                    }
                    
                    break;


            }
            if(textSplittedByGroupOfNumbers[i] !== undefined)
            {
                if(textSplittedByGroupOfNumbers[i].includes('('))
                {
                    let splittedByType = textScreenSplitted[i].split('(')

                    textSplittedByGroupOfNumbers.splice(i, 1, splittedByType[0], splittedByType[1]);
                }

                if(textSplittedByGroupOfNumbers[i].includes(')'))
                {
                    let splittedByType = textScreenSplitted[i].split(')')

                    textSplittedByGroupOfNumbers.splice(i, 1, splittedByType[0], splittedByType[1]);
                }
            }

            
        }


        return textSplittedByGroupOfNumbers;


    }

    getLastGroupOfNumbers()
    {
        return this.splitTextScreenByGroupOfNumbers()[this.splitTextScreenByGroupOfNumbers().length - 1];
    }

    getFirstType()
    {
        return this.screenText()[0];
    }

    splitTextScreenByType() {
        let textScreenSplitted = [...this.screenTextSplit()];

        let textSplittedWithoutSpace = [...this.screenTextSplit()];

        if(this.screenText().length > 1)
        {
            



                for(let i = 0; i < textScreenSplitted.length; i++)
                {
                    switch(textSplittedWithoutSpace[i])
                    {
                        case '':
                        case ' ':
                        
                            textSplittedWithoutSpace.splice(i, 1);
                            
                            i = 0;
                        
                        break;
                        case '-':

                            if((this.checkCharacterIsAOperator(textSplittedWithoutSpace[i-1]) || this.checkCharacterIsAOpeningParentheses(textSplittedWithoutSpace[i-1]) || this.getFirstType() === '-') && textScreenSplitted[i+1] !== ' ' && !isNaN(textScreenSplitted[i+1]))
                            {
                                let negativeNumber = textSplittedWithoutSpace[i] + textSplittedWithoutSpace[i+1];

                                negativeNumber = parseFloat(negativeNumber);

                                textSplittedWithoutSpace.splice(i, 2, negativeNumber);

                            }

                            break;

                    }
                }

                
            }

            return [...textSplittedWithoutSpace];
    }

        
    checkLastTypeIsAOperator()
    {
        let lastType = this.getLastType();
        let penultimateTypeIsAOperator = this.checkPenultimateTypeIsAOperator();
        let lastTypeIsANegativeSignal = this.checkLastTypeIsANegativeSignal();
        let lastTypeIsAOperator = false;
        

        if(lastType === '^' || lastType === '/' ||lastType === '*' ||lastType === '+')
        {
            lastTypeIsAOperator = true;
        }
        else
        {
            if(lastType === '-')
            {
                if(lastTypeIsANegativeSignal)
                {
                    lastTypeIsAOperator = false;
                }
                else
                {
                    lastTypeIsAOperator = true;
                }
            }
        }

        return lastTypeIsAOperator;
        
    }

    checkLastTypeIsAOppeningParentheses()
    {
        let lastType = this.getLastType();
        let isAOppening = false;
        
        if(lastType === '(')
        {
            isAOppening = true
        }
        else
        {
            isAOppening = false;
        }

        return isAOppening;
    }

    checkLastTypeIsACloseParentheses()
    {
        let lastType = this.getLastType();
        let isAClose = false;
        
        if(lastType === ')')
        {
            isAClose = true
        }
        else
        {
            isAClose = false;
        }

        return isAClose;
    }
    
    checkPenultimateTypeIsAOperator()
    {
       
        let penultimateType = this.getPenultimateType();
        let penultimateTypeIsAOperator = false;

        if(penultimateType === '^' || penultimateType === '/' ||penultimateType === '*' ||penultimateType === '+' || penultimateType === '-')
        {
            penultimateTypeIsAOperator = true;
        }
        else
        {
            penultimateTypeIsAOperator = false;
        }

        return penultimateTypeIsAOperator;
        
    }

    checkLastGroupIncludesADecimalPoint()
    {
        let lastGroupOfNumbers = this.getLastGroupOfNumbers();
        let includesADecimalPoint = false;

        if(lastGroupOfNumbers.includes('.'))
        {
            includesADecimalPoint = true;
        }
        else
        {
            includesADecimalPoint = false;
        }

        return includesADecimalPoint;

    }

    checkLastTypeIsADecimalPoint()
    {
        let lastType = this.getLastType();
        let lastTypeIsADecimal = false;
        if(lastType === '.')
        {
            lastTypeIsADecimal = true;
        }
        else
        {
            lastTypeIsADecimal = false;
        }

        return lastTypeIsADecimal;
    }
 
    inputDecimal() {
        
        let lastTypeIsAOperator = this.checkLastTypeIsAOperator();
        let lastTypeIsADecimal = this.checkLastTypeIsADecimalPoint();
        let lastGroupIncludesPoint = this.checkLastGroupIncludesADecimalPoint(); 

        if(!lastTypeIsAOperator && !lastTypeIsADecimal && !lastGroupIncludesPoint)
        {
            this.inputOnScreen('.');
        }
        

        console.log(this.splitTextScreenByGroupOfNumbers());
    }
    
    getLastType()
    {
    
        return this.splitTextScreenByType()[this.splitTextScreenByType().length - 1];
    }

    getPenultimateType()
    {
        return this.splitTextScreenByType()[this.splitTextScreenByType().length - 2];
    }

    checkPenulTypeIsAOppeParentheses(){
        let penultimateType = this.getPenultimateType();
        let isAOppeningOfParentheses = false;
        if(penultimateType === '(')
        {
            isAOppeningOfParentheses = true;
        }
        else
        {
            isAOppeningOfParentheses = false;

        }

        return isAOppeningOfParentheses;
    }

    splitScreenByParentheses()
    {
        let screenText = this.screenText();

        if(screenText.includes('('))
        {
        


            let teste = [...this.screenText().split('(')]
    
            let teste2 = [...this.screenText().split(')')]
    
    
            console.log(teste);
            console.log(teste2);
        }
       
    }
    
    checkLastTypeIsANegativeSignal()
    {
        let penultimateTypeIsAOperator = this.checkPenultimateTypeIsAOperator();
        let screenText = this.screenText();
        let lastType = this.getLastType();
        let penultimateTypeOppParentheses = this.checkPenulTypeIsAOppeParentheses();
        let isANegativeSignal = false;


        if(lastType === '-')
        {
            if(penultimateTypeOppParentheses || penultimateTypeIsAOperator || screenText === '-')
            {
                isANegativeSignal = true;
            }
            else{
                isANegativeSignal = false;
            }
            
        }
        

        return isANegativeSignal;
    }

    inputNegativeNumberOrOperator()
    {
        let lastTypeIsACloseParentheses = this.checkLastTypeIsACloseParentheses();
        let lastTypeIsAOperator = this.checkLastTypeIsAOperator();
        let lastTypeIsADecimalPoint = this.checkLastTypeIsADecimalPoint();
        let lastTypeIsANegativeSignal = this.checkLastTypeIsANegativeSignal();
        let lastTypeIsAOppeningParentheses = this.checkLastTypeIsAOppeningParentheses();
        let lastType = this.getLastType();
        let screenText = this.screenText();

        if((lastTypeIsAOperator && lastType !== '-' && lastType !== '+') || screenText === '' || lastTypeIsAOppeningParentheses)
        {
            this.inputOnScreen('-');
        }
        else
        {
            if((!lastTypeIsADecimalPoint && !lastTypeIsANegativeSignal) || lastTypeIsACloseParentheses)
            {
                this.inputOp(' - ');
            }
        }

    }
    
    deleteType()
    {
        let lastTypeIsAOperator = this.checkLastTypeIsAOperator();
        let lastTypeIsACloseParentheses = this.checkLastTypeIsACloseParentheses();
        let lastTypeIsADecimalPoint = this.checkLastTypeIsADecimalPoint();
        let lastTypeIsANegativeSignal = this.checkLastTypeIsANegativeSignal();
        let lastTypeIsAOppeningParentheses = this.checkLastTypeIsAOppeningParentheses();
        let lastType = this.getLastType();
        let textScreenSplitted = [...this.screenTextSplit()];


        if(lastTypeIsAOperator)
        {
            textScreenSplitted.pop();
            textScreenSplitted.pop();
            textScreenSplitted.pop();
        }
        else
        {
            if(lastTypeIsADecimalPoint || lastTypeIsANegativeSignal || lastTypeIsAOppeningParentheses || !isNaN(lastType))
            {
                textScreenSplitted.pop();
                if(lastTypeIsAOppeningParentheses)
                {
                    let deleteParentheses = this.OpenParentheses.textContent.split('');
                    deleteParentheses.pop();
                    this.OpenParentheses.textContent = deleteParentheses.join('');
                }
            }
            else
            {
                if(lastTypeIsACloseParentheses)
                {
                    textScreenSplitted.pop();
                    this.openParentheses();
                }
            }
        }

       this.Screen.textContent = textScreenSplitted.join('');
    }

    inputParentheses() {

        
        let screenText = this.screenText();
        let lastTypeIsAOppeningParentheses = this.checkLastTypeIsAOppeningParentheses();
        let lastType = this.getLastType()
        let lastTypeIsACloseParentheses = this.checkLastTypeIsACloseParentheses();
        let lastTypeIsAOperator = this.checkLastTypeIsAOperator();
        let lastTypeIsANegativeSignal = this.checkLastTypeIsANegativeSignal();
        let lastTypeIsADecimalPoint = this.checkLastTypeIsADecimalPoint();

        if(screenText === '')
        {
            this.inputOnScreen('(')
            this.openParentheses();
        }
        else
        {
            if(lastTypeIsAOppeningParentheses || lastTypeIsAOperator || lastTypeIsANegativeSignal || lastTypeIsADecimalPoint)
            {
                this.inputOnScreen('(')
                this.openParentheses();
            }
            else
            {
                if(!isNaN(lastType) || lastTypeIsACloseParentheses)
                {
                    this.inputOp(' * ');
                    this.inputOnScreen('(');
                    this.openParentheses();
                }
            }

            
        }
        this.splitScreenByParentheses();
    }

    openParentheses() {

        this.OpenParentheses.textContent += ')';

    }

    closeParenteses() {

        if(this.OpenParentheses.textContent !== '')
        {
            let lastTypeIsAOppeningParentheses = this.checkLastTypeIsAOppeningParentheses();
            let lastTypeIsAOperator = this.checkLastTypeIsAOperator();

            if(!lastTypeIsAOppeningParentheses && !lastTypeIsAOperator)
            {
                let closingParentheses = this.OpenParentheses.textContent.split('');
                closingParentheses.pop();
                this.OpenParentheses.textContent = closingParentheses.join('');
                this.inputOnScreen(')');
            }
        }
        
        
    }

    calculateOperations(_calculation)
    {
        let calculation = [..._calculation];
        let calculationPerformed =  [..._calculation];
        let numberBeforeOperation = 0;
        let numberAfterOperation = 0;
        let result = 0;
        


        if(calculation.includes('^'))
        {
            for(let i = 0; i < calculation.length; i++)
            {
                if(calculationPerformed[i] === '^')
                {
                    numberBeforeOperation = parseFloat(calculationPerformed[i-1]);
                    
                    numberAfterOperation = parseFloat(calculationPerformed[i+1]);

                    result = numberBeforeOperation ** numberAfterOperation;

                    calculationPerformed.splice((i-1), 3, result);

                    i = 0;

                }
            }
        }

        if(calculationPerformed.includes('*') || calculationPerformed.includes('/'))
        {
            calculationRightLeft:

            for(let i = 0; i < calculation.length; i++)
            {


                switch(calculationPerformed[i])
                {
                    case '*':
                    case '/':

                        if( calculationPerformed[i] === '*')
                        {
                            numberBeforeOperation = parseFloat(calculationPerformed[i-1]);
                        
                            numberAfterOperation = parseFloat(calculationPerformed[i+1]);
        
                            result = numberBeforeOperation * numberAfterOperation;
        
                            calculationPerformed.splice((i-1), 3, result);
        
                            i = 0;
                        }


                        if(calculationPerformed[i] === '/')
                        {
                            numberBeforeOperation = parseFloat(calculationPerformed[i-1]);
                        
                            numberAfterOperation = parseFloat(calculationPerformed[1+1]);
        
                            result = numberBeforeOperation / numberAfterOperation;
        
                            calculationPerformed.splice((i-1), 3, result);
        
                            i = 0;
                        }
                        
                        break;
                    case undefined:

                        
                    break calculationRightLeft;


                }

            }

        }



        if(calculationPerformed.includes('-') || calculationPerformed.includes('+'))
        {
            calculationRightLeft:

            for(let i = 0; i < calculation.length; i++)
            {


                switch(calculationPerformed[i])
                {
                    case '+':
                    case '-':

                        if( calculationPerformed[i] === '-')
                        {
                            numberBeforeOperation = parseFloat(calculationPerformed[i-1]);
                        
                            numberAfterOperation = parseFloat(calculationPerformed[i+1]);
        
                            result = numberBeforeOperation - numberAfterOperation;
        
                            calculationPerformed.splice((i-1), 3, result);
        
                            i = 0;
                        }


                        if(calculationPerformed[i] === '+')
                        {
                            numberBeforeOperation = parseFloat(calculationPerformed[i-1]);
                        
                            numberAfterOperation =  parseFloat(calculationPerformed[i+1]);
        
        
                            result = numberBeforeOperation + numberAfterOperation;
        
                            calculationPerformed.splice((i-1), 3, result);
        
                            i = 0;
                        }
                        
                        break;
                    case undefined:

                        
                    break calculationRightLeft;


                }

            }
        }

        console.log(calculationPerformed);

        return calculationPerformed[0];

    }


    calculateExpression()
    {
        let textScreenSplittedByType = [...this.splitTextScreenByType()];
        let textScreenCalculated = [...this.splitTextScreenByType()];
        let calculation = [];
        let firstCalculationIndexPerformed = 0;
        let replaceCalculationWithResult = 0;
        let result = 0;

        
        outisideOfParenthesesLoop:
        if(textScreenSplittedByType.includes('('))
        {
            for(let i = 0; i < textScreenSplittedByType.length; i++)
            {
               



                if(textScreenCalculated[i] !== undefined)
                {   
                    if(!isNaN(textScreenCalculated[i]))
                    {
                        textScreenCalculated[i] = parseFloat(textScreenCalculated[i]);
                    }

                    insideOfParenthesesLoop:
                    for(let j = i+1; j < textScreenSplittedByType.length; j++)
                    {

                        if(textScreenCalculated[i] !== undefined)
                        { 

                            if(calculation.length > 0)
                            {
                                replaceCalculationWithResult++;
                            }
                            else
                            {
                                replaceCalculationWithResult = 0;
                            }
                            
                            if(textScreenCalculated[j] !== '(' && textScreenCalculated[j] !== ')')
                            {

                                calculation.push(textScreenCalculated[j]);

                            }
                            
                            if(textScreenCalculated[j] === '(')
                            {
                                firstCalculationIndexPerformed = j;
                                calculation.length = 0;
                                continue;
                            }
                        
                            if(textScreenCalculated[j] === ')')
                            {
                                replaceCalculationWithResult++;
                                if(calculation.length === 2 && calculation.includes('-'))
                                {
                                    replaceCalculationWithResult++;
                                    result = parseFloat(calculation.join(''));
                                    textScreenCalculated.splice(firstCalculationIndexPerformed, replaceCalculationWithResult, result);
                                    console.log(result);
                                    break insideOfParenthesesLoop;
                                }
                                else
                                {

                                    if(calculation.length === 1)
                                    {
                                        replaceCalculationWithResult++;
                                        result = parseFloat(calculation[0]);
                                        textScreenCalculated.splice(firstCalculationIndexPerformed, replaceCalculationWithResult, result);
                                    }

                                    replaceCalculationWithResult++;
                                    result = this.calculateOperations(calculation);
                                    textScreenCalculated.splice(firstCalculationIndexPerformed, replaceCalculationWithResult, result);
                                    calculation.length = 0;
                                    i = 0;
                                    j = 0;
                                    replaceCalculationWithResult = 0;
                                   
                                    
                                    
                                }
                            }

                            if(textScreenCalculated.includes('('))
                            {
                                continue;
                            }
                            else
                            {
                                break insideOfParenthesesLoop;
                            }
                        }
                    }

                
                        
                    

                    if(textScreenCalculated.includes('('))
                    {
                        i = 0;
                        continue;
                    }
                    else
                    {
                    
                        result = this.calculateOperations(textScreenCalculated);
                        break outisideOfParenthesesLoop;
                    }
                }

            
                
            }
        }
        else
        {
            result = this.calculateOperations(textScreenCalculated);
        }
        

        

        console.log(result);

    }

}

const calculadora = new Calculadora();

calculadora.ligar();