'use strict';

const epubMaker = require('epub-maker');

module.exports = function ConverterEPUB(Asciidoctor) {
  class EPUBConverter {
    constructor(backend, opts) {
      this.basebackend = 'xml';
      this.outfilesuffix = '.epub';
      this.filetype = 'xml';
      this.htmlsyntax = 'xml';
      this._doc = new EpubMaker();
    }

    $convert(node, transform = null, opts = {}) {
      const {_doc: doc} = this;

      switch (transform || node.node_name) {
        case 'document':
          node.getContent();
          return String(doc);

        case 'section':
          if(node.getLevel() == 0) {
            doc.withSection('chapter', node.getId(), { title: node.getTitle(), content: node.getContent() }, true, false);
          } else {
            doc.withSub('chapter', node.getId(), { title: node.getTitle(), content: node.getContent() }, true, false);
          }
          return '';

        case 'paragraph':
          return node.getContent();

        case 'inline_quoted':
        case 'inline_anchor':
        case 'inline_break':
          return node.text;

        case 'listing':
          return `----\n${node.getContent()}\n----\n\n`;

        case 'ulist':
          return node.getItems().map((d) => `* ${d.getText()}`) + '\n';

        case 'olist':
          return node.getItems().map((d) => `1. ${d.getText()}`) + '\n';

        default:
          return node.text ? node.text : node.getContent();
      }
    }
  }

  Asciidoctor.Converter.Factory.$register(new EPUBConverter('epub'), ['epub']);
};
