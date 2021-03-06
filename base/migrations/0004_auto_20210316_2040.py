# Generated by Django 3.1.6 on 2021-03-16 20:40

import cloudinary.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_review_createdat'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orderitem',
            name='image',
            field=cloudinary.models.CloudinaryField(blank=True, max_length=255, null=True, verbose_name='image'),
        ),
        migrations.AlterField(
            model_name='product',
            name='image',
            field=cloudinary.models.CloudinaryField(blank=True, default='/placeholder.png', max_length=255, null=True, verbose_name='image'),
        ),
    ]
