export default class ListView extends Phaser.GameObjects.Container {

    constructor ({
        context,
        height = 100,
        width = 100,
        x = 0,
        y = 0,
        padding = 10,
        background = 0x009688
    } = {}) {
        super(context, x, y);

        this.setExclusive(true);
        this.setSize(width, height);

        this.setInteractive({
            hitArea: new Phaser.Geom.Rectangle(width / 2, height / 2, width, height),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
            draggable: true,
            useHandCursor: true
        });

        this.backgroundColour = background;
        this.camera = this.scene.cameras.add(this.x + padding, this.y + padding, this.width - padding * 2, this.height - padding * 2);

        this.scrollPos = 0;
        this.scene.input.on('dragstart', (pointer, target) => target === this && (this.scrollPos = this.camera.scrollY));
        this.scene.input.on('drag', (pointer, target, x, y) => {
            if (target !== this) return;

            const min = this.y;
            const max = this.y + this.height - this.scrollBar.displayHeight + 20;
            const val = Phaser.Math.Clamp(this.scrollPos - (y - this.y), min, max);
            const scrollPerc = Phaser.Math.Clamp((val - min) / (max - min), 0, 1);
            const barScroll = this.height - this.scrollBar.displayHeight;

            this.scrollBar.setY(barScroll * scrollPerc + this.y);
            this.camera.setScroll(0, val);
        });

        this.scene.make.graphics({ x: 0, y: 0, add: false })
            .fillStyle(0xff0000, 1)
            .fillRect(0, 0, 50, 10)
            .generateTexture('scroll', 1, 1);
        this.scrollBar = this.scene.add.sprite(0, 0, 'scroll')
            .setOrigin(0, 0)
            .setPosition(x + width, y)
            .setInteractive({
                useHandCursor: true
            });
        this.scene.input.setDraggable(this.scrollBar);

        this.scrollBar.on('drag', (pointer, x, y) => {
            const {
                height
            } = this.getBounds();
            const min = this.y;
            const max = this.y + this.height - this.scrollBar.displayHeight;
            const val = Phaser.Math.Clamp(y, this.y, this.y + this.height - this.scrollBar.displayHeight);
            const scrollPerc = Phaser.Math.Clamp((val - min) / (max - min), 0, 1);
            const cameraScroll = height - this.camera.height;

            this.scrollBar.setY(val);
            this.camera.setScroll(0, cameraScroll * scrollPerc + this.y);
        });

        this.createBackground();
    }

    preUpdate (...args) {
        const cameras = this.scene.cameras.cameras;

        this.getAll()
            .forEach(child =>
                cameras.forEach(camera =>
                    camera.id !== this.camera.id && camera.ignore(child)
                )
            );

        this.scene.sys.displayList.getAll()
            .forEach(child => this.camera.ignore(child));

        return this.update(...args);
    }

    update() {
        const {
            height
        } = this.getBounds();
        const percHeight = Phaser.Math.Clamp(this.camera.height / height, 0.1, 1);

        this.scrollBar.setDisplaySize(10, percHeight * this.height);
    }

    add (items = []) {
        (Array.isArray(items) ? items : [ items ])
            .map(item => {
                const {
                    height
                } = this.getBounds();
                const x = 0;
                const y = height > 0 ? height + 10 : 0;

                item
                    .setPosition(x, y)
                    .setOrigin(0, 0);

                super.add(item);
            });

        const {
            height,
            width
        } = this.getBounds();
        this.camera.setBounds(this.x, this.y, width, height);

        return this;
    }

    createBackground () {
        return this.scene.add.graphics(0, 0)
            .fillStyle(this.backgroundColour, 1)
            .fillRoundedRect(this.x, this.y, this.width, this.height, 5)
            .setDepth(-1);
    }

}
