var EVAL_FN = 'x * sin(y) + y * sin(x)';
var VARIABLE_SIZE = 13; // number of genes representing single variable in chromosome (x or y)
var CHROMOSOME_SIZE = VARIABLE_SIZE * 2; // we have two variables in chromosome (x and y)
var POPULATION_SIZE = 50;
var SELECTION_COUNT = 25; // number of the best chromosomes selected by selection
var MAX_GENERATIONS = 50; // (stop condition) how many generations we will generate before stopping the calculations
var CROSSOVER_PROBABILITY = 0.5;
var MUTATION_PROBABILITY = 0.25;
var MAXIMIZATION = true; // we search for maximum?
var space = {x1: 0, xn: 8, y1: 0, yn: 8}; // available space of search (X, Y axis)
var ranges = [
    [space.x1, space.xn],
    [space.y1, space.yn]
];
var population = []; // the current population


/**
 * Evaluates value of the objective function, sets the chromosome position x,y and eval.
 * @param chromosome The chromosome representing solution.
 */
function fxy(chromosome) {

    var variables = decodeBinaryChromosome(chromosome.genes, 2, ranges);

    // calculate real x,y coordinates
    var x = variables[0];
    var y = variables[1];
    chromosome.x = x;
    chromosome.y = y;

    // here we can implement penalty function when the chromosome is outside the ranges or violates constraints
    if (x < space.x1 || x > space.xn || y < space.y1 || y > space.yn) {
        // make this chromosome very bad one according to target optimization
        chromosome.eval = MAXIMIZATION ? Number.MIN_VALUE : Number.MAX_VALUE;
        return chromosome;
    }

    chromosome.eval = math.evaluate(EVAL_FN, {
        x: x, y: y
    });
    return chromosome;

}

/**
 * Generates true or false - 0 or 1, binary gene.
 * @returns {number} Number 1 or 0.
 */
function generateGene() {
    var value = Math.random();
    return value < 0.5 ? 0 : 1;
}

/**
 * Generates a random chromosome.
 * @returns {{eval: number, genes: [], x, y}} New chromosome reference.
 */
function generateChromosome() {
    var chromosome = {
        genes: [],
        eval: 0
    };
    for (var i = 0; i < CHROMOSOME_SIZE; i++) {
        chromosome.genes.push(generateGene());
    }
    fxy(chromosome);
    return chromosome;
}

function cloneChromosome(chromosome) {
    return {
        genes: chromosome.genes.slice(),
        eval: chromosome.eval,
        x: chromosome.x,
        y: chromosome.y
    };
}

/**
 * Creates a new population of chromosomes.
 * @returns {*[]}
 */
function createPopulation() {
    var population = [];
    for (var i = 0; i < POPULATION_SIZE; i++) {
        population.push(generateChromosome());
    }
    return population;
}

/**
 * Selects a number of the best individuals from population and removes the rest,
 * the population is decreased by the worst chromosomes.
 * @param trim Trim the population to SELECTION_COUNT.
 */
function selection(trim) {
    // sort population
    population.sort(function (chromosomeA, chromosomeB) {
        // search for maximum, so we sort bigger values (evaluations) at the beginning as the
        // best chromosomes
        return MAXIMIZATION
            // result < 0 will sort A before B (B < A => result < 0)
            // result > 0 will sort B before A (A < B => result > 0)
            // result = 0 will leave the order
            ? chromosomeB.eval - chromosomeA.eval

            // result < 0 will sort B before A (A < B => result < 0)
            // result > 0 will sort A before B (B < A => result > 0)
            // result = 0 will leave the order
            : chromosomeA.eval - chromosomeB.eval;
    });

    // select only the best chromosomes, remove the rest from population
    population = population.slice(0, POPULATION_SIZE);
}

/**
 * Generates new chromosomes by crossover until population has again the initial number of chromosomes.
 */
function crossover() {
    var parents = [];
    for (var i = 0; i < population.length; i++) {
        if (parents.indexOf(i) >= 0) {
            continue; // skip already selected parent
        }
        if (Math.random() < CROSSOVER_PROBABILITY) {
            parents.push(i);
        }
    }

    // if odd number of parents choose one more
    var index = -1;
    while (parents.length % 2 === 1) {
        index++;
        index = index === population.length ? 0 : index;

        // select another parent
        if (parents.indexOf(index) >= 0) {
            continue; // skip already selected parent
        }
        if (Math.random() < CROSSOVER_PROBABILITY) {
            parents.push(index);
            break;
        }

    }

    // crossover parents and extend population by new children
    for (var i = 0; i < parents.length; i+=2) {
        // crossover parents
        var crossingPoint = getRandomInt(1, CHROMOSOME_SIZE - 2);// from 1 to make crossover up to one less than last one
        var chromosomeA = cloneChromosome(population[parents[i]]);
        var chromosomeB = cloneChromosome(population[parents[i+1]]);

        var a1 = chromosomeA.genes.slice(0, crossingPoint);
        var a2 = chromosomeA.genes.slice(crossingPoint);
        var b1 = chromosomeB.genes.slice(0, crossingPoint);
        var b2 = chromosomeB.genes.slice(crossingPoint);

        chromosomeA.genes = a1.concat(b2);
        chromosomeB.genes = b1.concat(a2);

        // clear old information about position and eval in chromosomes
        chromosomeA.x = undefined;
        chromosomeA.y = undefined;
        chromosomeA.eval = undefined;
        chromosomeB.x = undefined;
        chromosomeB.y = undefined;
        chromosomeB.eval = undefined;

        population.push(chromosomeA);
        population.push(chromosomeB);
    }
}

function mutation() {
    // mutate only children
    for (var i = POPULATION_SIZE - 1; i < population.length; i++) {
        var shouldMutate = Math.random() < MUTATION_PROBABILITY;
        if (shouldMutate) {
            // choose gene to mutate
            var geneIndex = getRandomInt(0, CHROMOSOME_SIZE - 1);
            population[i].genes[geneIndex] = getRandomInt(0, 1); // random value 0 or 1 - mutation
        }
    }
}

function evaluation() {
    for (var i = 0; i < population.length; i++) {
        fxy(population[i]);
    }
}

function run(options) {
    if (options) {
        EVAL_FN = options.evalFunction;
        VARIABLE_SIZE = options.variableSize;
        CHROMOSOME_SIZE = VARIABLE_SIZE * 2;
        MUTATION_PROBABILITY = options.pm;
        CROSSOVER_PROBABILITY = options.pc;
        POPULATION_SIZE = options.popSize;
        SELECTION_COUNT = options.selCount;
        MAX_GENERATIONS = options.maxGenerations;
        MAXIMIZATION = options.maximize;
        space.x1 = options.x1;
        space.xn = options.xn;
        space.y1 = options.y1;
        space.yn = options.yn;
    }

    // Classic genetic algorithm - binary chromosome representation

    // 1. Create an initial population
    //    during generation we also evaluate each chromosome value
    population = createPopulation();

    // 2. Start calculations
    var generation = 0;
    while (generation < MAX_GENERATIONS) {
        crossover(); // generates new chromosomes to fill in population
        mutation(); // mutate random genes in chosen chromosomes
        evaluation(); // make sure everything is calculated correctly after all operators
        selection(); // leave only the best solutions and limit population back to fixed size
        generation++;
    }

    // 3. sort population and get the best individual
    selection();

    return population;
}