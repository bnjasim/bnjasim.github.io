# Sentence Embeddings

How to concisely represent a sentence using a real valued vector? The simplest baseline is an average of word embeddings.
Why Sentence Embeddings? well, an example application is sentiment analysis. Sentence embeddings can capture the semantics of a sentnece or a paragraph. This has shown to give state of the art results for sentiment analysis ([SST](https://nlp.stanford.edu/sentiment)). Other tasks include question answering.

## Classical Papers
- DAN (Deep Unordered Composition Rivals Syntactic Methods for Text Classification) ([Code](https://github.com/miyyer/dan))
- A Simple But Tough-to-beat Baseline For Sentence Embeddings
- Concatenated Power Mean Embeddings as Universal Cross-Lingual Sentence Representations
- Unsupervised Learning of Sentence Embeddings using Compositional N-Gram Features ([Paper](https://arxiv.org/abs/1703.02507)), ([Code](https://github.com/epfml/sent2vec)) & ([Blog](https://rare-technologies.com/sent2vec-an-unsupervised-approach-towards-learning-sentence-embeddings/))

## Latest Papers
- Unsupervised Random Walk Sentence Embeddings: A Strong but Simple Baseline (ACL 2018 Workshop) ([Code](https://github.com/kawine/usif))
- Probabilistic FastText for Multi-Sense Word Embeddings
- Autoencoder-based Universal Language Representation for Machine Translation
- Dynamic Meta-Embeddings for Improved Sentence Representations
- Learning Robust, Transferable Sentence Representations For Text Classification (ICLR 2019 Submission)
- Universal Sentence Encoder, Google. ([Paper](https://arxiv.org/pdf/1803.11175.pdf)) & ([Link](https://tfhub.dev/google/universal-sentence-encoder-large/1))


## Evaluation Tasks
- Natural language inference (SNLI and MultiNLI) [\[Link\]](https://nlp.stanford.edu/projects/snli/)
- Sentiment analysis (SST - Stanford Sentiment Tagger)
- Image-caption retrieval (Flickr30k)
- Sentences Involving Compositional Knowledge (SICK) corpus
- SQuAD
- GLUE

## Github Repos
- [Old Awesome List](https://github.com/ccywch/awesome-sentence-embedding) 
- [Awesome List Github](https://github.com/Hironsan/awesome-embedding-models)
- [InferSent](https://github.com/facebookresearch/InferSent)
- [Dynamic Meta Embeddings](https://github.com/facebookresearch/DME)
- [Jiant](https://github.com/jsalt18-sentence-repl/jiant)

## State Of The Art Techniques
- Deep contextualized word representations (ELMO)
- UlmFit
- BERT [Reddit Discussion](https://www.reddit.com/r/MachineLearning/comments/9nfqxz/r_bert_pretraining_of_deep_bidirectional)
- USE (Google's Universal Sentence Encoder)

```
Query sentence? 
He is good at cricket.
1 14349 Bill is good at mathematics. 
0.837192 37015 He is good at taking photos. 
0.804996 73607 She's good at tennis. 
0.65248 44726 It doesn’t look good at all. 
0.651186 55831 OK, this is good stuff. 
0.627802 87006 Politicians are good at raising money. 
0.610185 80687 And let's pretend the other one is good at language skills. 
0.574956 49473 How did you get so good at French? 
0.574956 28365 How did you get so good at French? 
0.546333 84034 It is good for business – in particular for SMEs – and it is good for jobs. 

```


~~~
Query sentence? 
The president of the United States is visiting Moscow tomorrow.
0.574571 65954 The French president is to visit Japan next month. 
0.488353 33210 This president has written his memoirs. 
0.482669 42021 The president governs for four years. 
0.467511 22426 Why are you visiting us? 
0.463599 75567 The president wanted immediate action. 
0.458837 82053 NEW DELHI – Barack Obama, the sixth American president to visit India since it gained independence, arrives at a trying time, both for the United States and for India. 
0.458138 50898 Halfway through this process, I met the president of Kiribati, President Anote Tong. 
0.429796 32458 The President of the Commission is elected. 
0.427436 51778 Mr Barroso and Mrs Wallström will be visiting Copenhagen on Friday. 
0.423965 93454 We are talking here about a former Finnish president, the former president of the International Red Cross and the former High Commissioner for Refugees. 
~~~
