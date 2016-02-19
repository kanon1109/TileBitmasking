//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer
{
    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView:LoadingUI;
    //地形掩码计算
    private tileBitmasking:TileBitmasking;
    //瓦片纹理
    private tileTexture:egret.Texture;
    //地形0的纹理
    private terrain0Texture:egret.Texture;
    //是否点击
    private isTouched:boolean;
    //瓦片大小
    private tileWidth:number = 36;
    //瓦片大小
    private tileHeight:number = 36;
    //是否擦除状态
    private isErase:boolean;
    //存放有地形瓦片的字典
    private terrainAry:any[];
    //地形纹理列表
    private terrainTextureAry:any[];
    public constructor()
    {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event)
    {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void
    {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void
    {
        if (event.groupName == "preload")
        {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.init();
            this.initTerrainTextures();
            this.initTile();
        }
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void
    {
        if (event.groupName == "preload")
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
    }

    /**
     * 初始化
     */
    private init():void
    {
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginHandler, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveHandler, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndHandler, this);
        this.terrainAry = [];
        this.tileTexture = RES.getRes("tile");
        this.terrain0Texture = RES.getRes("tile0");
    }

    /**
     * 初始化瓦片
     * Create a game scene
     */
    private initTile():void
    {
        this.tileBitmasking = new TileBitmasking(100, 100);
        var rows:number = this.tileBitmasking.rows;
        var columns:number = this.tileBitmasking.columns;
        for(var i:number = 0; i < rows; i++)
        {
            for(var j:number = 0; j < columns; j++)
            {
                var tileBmp:egret.Bitmap = new egret.Bitmap();
                tileBmp.texture = this.tileTexture;
                tileBmp.x = j * this.tileWidth;
                tileBmp.y = i * this.tileHeight;
                this.addChild(tileBmp);
            }
        }
    }

    /**
     * 初始化地形纹理列表
     */
    private initTerrainTextures():void
    {
        this.terrainTextureAry = [];
        for(var i:number = 0; i < 16; i++)
        {
            var texture:egret.Texture = RES.getRes("terrain" + i);
            this.terrainTextureAry.push(texture);
        }
    }

    private touchBeginHandler(event:egret.TouchEvent):void
    {
        this.isTouched = true;
        var tile:Tile = this.tileBitmasking.getTileByPos(event.stageX,
                                                         event.stageY,
                                                         this.tileWidth,
                                                         this.tileHeight);
        this.isErase = tile.isTerrain;
        this.createTileBmpByMousePos(event.stageX, event.stageY, this.terrain0Texture);
    }

    private touchEndHandler(event:egret.TouchEvent):void
    {
        this.isTouched = false;
        this.createDynamicTile();
    }

    private touchMoveHandler(event:egret.TouchEvent):void
    {
       if(this.isTouched)
          this.createTileBmpByMousePos(event.stageX, event.stageY, this.terrain0Texture);
    }

    /**
     * 根据点击移动的位置创建瓦片
     * @param mouseX        移动位置
     * @param mouseY        移动位置
     * @param texture       瓦片纹理
     */
    private createTileBmpByMousePos(mouseX:number, mouseY:number, texture:egret.Texture):void
    {
        var tile:Tile = this.tileBitmasking.getTileByPos(mouseX,
                                                         mouseY,
                                                         this.tileWidth,
                                                         this.tileHeight);
        var tileBmp:egret.Bitmap;
        if(!tile.isTerrain && !this.isErase)
        {
            tile.isTerrain = true;
            tileBmp = new egret.Bitmap();
            tileBmp.texture = texture;
            tileBmp.x = tile.column * this.tileWidth;
            tileBmp.y = tile.row * this.tileHeight;
            this.addChild(tileBmp);
            tile.userData = tileBmp;
            this.terrainAry.push(tile);
        }
        if(tile.isTerrain && this.isErase)
        {
            tile.isTerrain = false;
            tileBmp = tile.userData as egret.Bitmap;
            if(tileBmp.parent)
               tileBmp.parent.removeChild(tileBmp);
            tile.userData = null;
            this.terrainAry.splice(this.terrainAry.indexOf(tile), 1);
        }
    }


    /**
     * 创建动态地形
     */
    private createDynamicTile():void
    {
        var count:number = this.terrainAry.length;
        console.log("count", count);
        for(var i:number = 0; i < count; ++i)
        {
            var tile:Tile = this.terrainAry[i];
            var tileBmp:egret.Bitmap = tile.userData as egret.Bitmap;
            if(tileBmp.parent)
               tileBmp.parent.removeChild(tileBmp);
            var index:number = this.tileBitmasking.math4BitDirValues(tile.row, tile.column);
            var terrainTexture:egret.Texture = this.terrainTextureAry[index];
            tileBmp = new egret.Bitmap();
            tileBmp.texture = terrainTexture;
            tileBmp.x = tile.column * this.tileWidth;
            tileBmp.y = tile.row * this.tileHeight;
            this.addChild(tileBmp);
            tile.userData = tileBmp;
        }
    }
}


