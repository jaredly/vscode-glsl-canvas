'use strict';

import * as path from 'path';
import * as vscode from 'vscode';
import { currentGlslDocument } from './common';

const LANGUAGES = ['glsl', 'cpp', 'c'];

export default class GlslOptions {

	public uri: vscode.Uri;
	public workpath: string;
	public fragment: string;
	public vertex: string;
	public uniforms: object;
	public textures: object;
	public timeout: number;
	public refreshOnChange: boolean;
	public refreshOnSave: boolean;

	constructor() {
		const document: vscode.TextDocument = currentGlslDocument();
		const config = vscode.workspace.getConfiguration('glsl-canvas');
		this.uri = document ? document.uri : null;
		this.fragment = document ? document.getText() : '';
		this.vertex = '';
		this.uniforms = config['uniforms'] || {};
		this.timeout = config['timeout'] || 0;
		this.textures = Object.assign({}, config['textures'] || {});
		const folder = vscode.workspace ? vscode.workspace.rootPath : null;
		if (folder) {
			Object.keys(this.textures).forEach(x => {
				const texture = this.textures[x];
				if (texture.indexOf('http') !== 0 && texture.indexOf('file') !== 0) {
					this.textures[x] = 'vscode-resource:' + vscode.Uri.file(path.join(folder, texture)).path;
				}
			});
			this.workpath = 'vscode-resource:' + vscode.Uri.file(folder).path;
		} else {
			this.workpath = '';
		}
		// console.log('workpath', this.workpath);
		this.refreshOnChange = config['refreshOnChange'] || false;
		this.refreshOnSave = config['refreshOnSave'] || false;
	}

	public serialize(): string {
		return JSON.stringify(this);
	}

}
